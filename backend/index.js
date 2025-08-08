require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require("./config/mongoConnection");
const Holdings = require('./model/Holdings');
const Orders = require('./model/Orders');
const Positions = require('./model/Positions');
const cookieParser = require('cookie-parser');
const authRoute = require('./Routes/AuthRoute');

app.use(cors({
    origin: [
        "https://zerodha-dashboard-sg.vercel.app", 
        "https://zerodha-sg.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRoute);

app.get('/', (req, res) => {
    res.json({ 
        message: "Zerodha Clone API",
        status: "Server is running"
    });
});

app.get('/allHoldings', async (req, res) => {
    try {
        await connectDB();
        let allHoldings = await Holdings.find({});
        
        // Remove duplicates by name, keep the most recent one
        const uniqueHoldings = [];
        const seenNames = new Set();
        
        for (const holding of allHoldings) {
            if (!seenNames.has(holding.name)) {
                uniqueHoldings.push(holding);
                seenNames.add(holding.name);
            }
        }
        
        res.json(uniqueHoldings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch holdings" });
    }
});

app.post('/newOrder', async (req, res) => {
    try {
        const { name, qty, price, mode } = req.body;
        const newOrder = new Orders({
            name: name,
            qty: parseInt(qty),
            price: parseFloat(price),
            mode: mode,
        });

        await newOrder.save();
        
        if (mode === "BUY") {
            await connectDB();
            const existingHolding = await Holdings.findOne({ name: name });
            
            if (existingHolding) {
                const totalQty = existingHolding.qty + parseInt(qty);
                const totalValue = (existingHolding.avg * existingHolding.qty) + (parseFloat(price) * parseInt(qty));
                const newAvg = totalValue / totalQty;
                
                await Holdings.updateOne(
                    { name: name },
                    { 
                        qty: totalQty,
                        avg: newAvg,
                        price: parseFloat(price)
                    }
                );
            } else {
                const newHolding = new Holdings({
                    name: name,
                    qty: parseInt(qty),
                    avg: parseFloat(price),
                    price: parseFloat(price),
                    net: "+0.00%",
                    day: "+0.00%",
                });
                await newHolding.save();
            }
        } else if (mode === "SELL") {
            await connectDB();
            const existingHolding = await Holdings.findOne({ name: name });
            
            if (existingHolding && existingHolding.qty >= parseInt(qty)) {
                const newQty = existingHolding.qty - parseInt(qty);
                
                if (newQty === 0) {
                    await Holdings.deleteOne({ name: name });
                } else {
                    await Holdings.updateOne(
                        { name: name },
                        { 
                            qty: newQty,
                            price: parseFloat(price)
                        }
                    );
                }
            } else {
                return res.status(400).json({ error: "Insufficient holdings to sell" });
            }
        }
        
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
    }
});

app.get('/allOrders', async (req, res) => {
    try {
        let allOrders = await Orders.find({});
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.get('/allPositions', async (req, res) => {
    try {
        let allPositions = await Positions.find({});
        
        // Remove duplicates by name, keep the most recent one
        const uniquePositions = [];
        const seenNames = new Set();
        
        for (const position of allPositions) {
            if (!seenNames.has(position.name)) {
                uniquePositions.push(position);
                seenNames.add(position.name);
            }
        }
        
        res.json(uniquePositions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch positions" });
    }
});

app.post('/cleanup-duplicates', async (req, res) => {
    try {
        await connectDB();
        
        // Clean up duplicate holdings
        const allHoldings = await Holdings.find({});
        const holdingsMap = new Map();
        const duplicateHoldings = [];
        
        for (const holding of allHoldings) {
            if (holdingsMap.has(holding.name)) {
                // Mark for deletion - keep the latest one
                const existing = holdingsMap.get(holding.name);
                if (holding._id > existing._id) {
                    duplicateHoldings.push(existing._id);
                    holdingsMap.set(holding.name, holding);
                } else {
                    duplicateHoldings.push(holding._id);
                }
            } else {
                holdingsMap.set(holding.name, holding);
            }
        }
        
        // Remove duplicates
        if (duplicateHoldings.length > 0) {
            await Holdings.deleteMany({ _id: { $in: duplicateHoldings } });
        }
        
        // Clean up duplicate positions
        const allPositions = await Positions.find({});
        const positionsMap = new Map();
        const duplicatePositions = [];
        
        for (const position of allPositions) {
            if (positionsMap.has(position.name)) {
                const existing = positionsMap.get(position.name);
                if (position._id > existing._id) {
                    duplicatePositions.push(existing._id);
                    positionsMap.set(position.name, position);
                } else {
                    duplicatePositions.push(position._id);
                }
            } else {
                positionsMap.set(position.name, position);
            }
        }
        
        if (duplicatePositions.length > 0) {
            await Positions.deleteMany({ _id: { $in: duplicatePositions } });
        }
        
        res.json({ 
            message: "Duplicates cleaned up successfully",
            removedHoldings: duplicateHoldings.length,
            removedPositions: duplicatePositions.length
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to clean up duplicates" });
    }
});

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
