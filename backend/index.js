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
        res.json(allHoldings);
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
            const existingHolding = await Holdings.findOne({ name: name });
            
            if (existingHolding) {
                const totalQty = existingHolding.qty + parseInt(qty);
                const totalValue = (existingHolding.avg * existingHolding.qty) + (parseFloat(price) * parseInt(qty));
                const newAvg = totalValue / totalQty;
                
                existingHolding.qty = totalQty;
                existingHolding.avg = newAvg;
                existingHolding.price = parseFloat(price);
                await existingHolding.save();
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
            const existingHolding = await Holdings.findOne({ name: name });
            
            if (existingHolding && existingHolding.qty >= parseInt(qty)) {
                existingHolding.qty -= parseInt(qty);
                existingHolding.price = parseFloat(price);
                
                if (existingHolding.qty === 0) {
                    await Holdings.deleteOne({ name: name });
                } else {
                    await existingHolding.save();
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
        res.json(allPositions);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch positions" });
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
