const mongoose = require('mongoose');
const { Schema } = mongoose;

const HoldingsSchema = new Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});

const HoldingsModel = mongoose.model("Holding", HoldingsSchema);

module.exports = HoldingsModel;