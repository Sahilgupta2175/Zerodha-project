require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const cors = require('cors');
const dbURL = require("./config/mongoConnection");
const Holdings = require('./model/Holdings');
const Positions = require('./model/Positions');
const holdingSampleData = require('./SampleData/HoldingSampleData');
const positionSampleData = require('./SampleData/PositionSampleData');

// Connect to database
dbURL();

app.use(cors());
app.use(bodyParser.json());

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

// Showing all Postions to the user
app.get('/allPositions', async (req, res) => {
    let allPositions = await Positions.find({});
    res.json(allPositions);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
