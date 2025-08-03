import { Schema, Model } from 'mongoose';

const HoldingsSchema = new Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
});

const HoldingsModel = Model("Holding", HoldingsSchema);

module.exports = HoldingsModel;