require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const cors = require('cors');
const dbURL = require("./config/mongoConnection");
const Holdings = require('./model/Holdings');
const Orders = require('./model/Orders');
const Positions = require('./model/Positions');
const holdingSampleData = require('./SampleData/HoldingSampleData');
const positionSampleData = require('./SampleData/PositionSampleData');
const cookieParser = require('cookie-parser');
const authRoute = require('./Routes/AuthRoute');

// Connect to database
dbURL();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth routes should be registered early
app.use('/', authRoute);

// Index Route
app.get('/', (req, res) => {
    res.send("Hi, I am root Route");
});

// Adding Holdings Sample Data Route
app.get("/addHoldings", async (req, res) => {
    let tempHolding = holdingSampleData;

    tempHolding.forEach((item) => {
        let newHolding = new Holdings({
            name: item.name,
            qty: item.qty,
            avg: item.avg,
            price: item.price,
            net: item.net,
            day: item.day,
        });

        newHolding.save();
    });
    
    res.send("Holdings Sample Data added Successfully."); 
});

// Adding Positions Sample Data Route
app.get('/addPositions', async (req, res) => {
    let tempPosition = positionSampleData;

    tempPosition.forEach((item) => {
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

        newPosition.save();
    });

    res.send("Positions Sample Data added Successfully."); 
});

// Showing all Holdings to the user
app.get('/allHoldings', async (req, res) => {
    let allHoldings = await Holdings.find({});
    res.json(allHoldings);
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
    let allPositions = await Positions.find({});
    res.json(allPositions);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
