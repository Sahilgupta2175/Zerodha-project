import { Schema, Model } from "mongoose";

const OrdersSchema = new Schema({
    name: String,
    qty: Number,
    price: Number,
    mode: String,
});

const OrdersModel = Model("Order", OrdersSchema);

module.exports = OrdersModel;