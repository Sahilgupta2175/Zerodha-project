require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

// Environment variable validation
console.log('Environment variables check:');
console.log('PORT:', PORT);
console.log('ATLAS_DB_URL:', process.env.ATLAS_DB_URL ? 'Set' : 'Not set');
console.log('TOKEN_KEY:', process.env.TOKEN_KEY ? 'Set' : 'Not set');

const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require("./config/mongoConnection");
const Holdings = require('./model/Holdings');
const Orders = require('./model/Orders');
const Positions = require('./model/Positions');
const holdingSampleData = require('./SampleData/HoldingSampleData');
const positionSampleData = require('./SampleData/PositionSampleData');
const cookieParser = require('cookie-parser');
const authRoute = require('./Routes/AuthRoute');

// Configure CORS to allow frontend
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

// Auth routes should be registered early
app.use('/', authRoute);

// Index Route
app.get('/', (req, res) => {
    res.json({ 
        message: "Hi, I am root Route",
        status: "Server is running",
        env: {
            PORT: PORT,
            hasDbUrl: !!process.env.ATLAS_DB_URL,
            hasTokenKey: !!process.env.TOKEN_KEY
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Database connectivity test endpoint
app.get('/db-test', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        
        res.json({
            status: 'OK',
            database: {
                state: states[dbState] || 'unknown',
                stateCode: dbState,
                hasUrl: !!process.env.ATLAS_DB_URL
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            error: error.message
        });
    }
});

// Adding Holdings Sample Data Route
app.get("/addHoldings", async (req, res) => {
    try {
        let tempHolding = holdingSampleData;

        const promises = tempHolding.map(async (item) => {
            let newHolding = new Holdings({
                name: item.name,
                qty: item.qty,
                avg: item.avg,
                price: item.price,
                net: item.net,
                day: item.day,
            });

            return await newHolding.save();
        });

        await Promise.all(promises);
        res.send("Holdings Sample Data added Successfully."); 
    } catch (error) {
        console.error("Error adding holdings:", error);
        res.status(500).json({ error: "Failed to add holdings data" });
    }
});

// Adding Positions Sample Data Route
app.get('/addPositions', async (req, res) => {
    try {
        let tempPosition = positionSampleData;

        const promises = tempPosition.map(async (item) => {
            let newPosition = new Positions({
                product: item.product,
                name: item.name,
                qty: item.qty,
                avg: item.avg,
                price: item.price,
                net: item.net,
                day: item.day,
                isLoss: item.isLoss,
            });

            return await newPosition.save();
        });

        await Promise.all(promises);
        res.send("Positions Sample Data added Successfully."); 
    } catch (error) {
        console.error("Error adding positions:", error);
        res.status(500).json({ error: "Failed to add positions data" });
    }
});

// Showing all Holdings to the user
app.get('/allHoldings', async (req, res) => {
    try {
        let allHoldings = await Holdings.find({});
        res.json(allHoldings);
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: "Failed to fetch holdings" });
    }
});

// Create new order
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
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// Showing all Orders to the user
app.get('/allOrders', async (req, res) => {
    try {
        let allOrders = await Orders.find({});
        res.json(allOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Showing all Postions to the user
app.get('/allPositions', async (req, res) => {
    try {
        let allPositions = await Positions.find({});
        res.json(allPositions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ error: "Failed to fetch positions" });
    }
});

// Start server and connect to database
async function startServer() {
    try {
        // Start the server first
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });

        // Then connect to database (non-blocking)
        connectDB().then(() => {
            console.log('Database connected after server start');
        }).catch((error) => {
            console.error('Database connection failed, but server is still running:', error);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the application
startServer();
