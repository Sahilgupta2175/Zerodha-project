import { Schema, Model, Model } from "mongoose";

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

const PositionsModel = Model("Position", PositionsSchema);

module.exports = PositionsModel;