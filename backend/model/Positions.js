const mongoose = require("mongoose");
const { Schema } = mongoose;

const PositionsSchema = new Schema({
    product: String,
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    isLoss: Boolean,
});

const PositionsModel = mongoose.model("Position", PositionsSchema);

module.exports = PositionsModel;