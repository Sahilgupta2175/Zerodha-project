import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Orders.css';
import axios from 'axios';

function Orders() {
    let [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/allOrders').then((result) => {
            setAllOrders(result.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <>
            <h3 className="title">Orders ({allOrders.length})</h3>
            {allOrders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="order-table">
                    <table>
                        <tr>
                            <th>Stock Name</th>
                            <th>Qty.</th>
                            <th>Price</th>
                            <th>Mode</th>
                            <th>Total Value</th>
                        </tr>

                        {allOrders.map((order, index) => {
                            const totalValue = order.price * order.qty;
                            const modeClass = order.mode === "BUY" ? "buy-mode" : "sell-mode";

                            return (
                                <tr key={index}>
                                    <td>{order.name}</td>
                                    <td>{order.qty}</td>
                                    <td>₹{order.price.toFixed(2)}</td>
                                    <td className={modeClass}>{order.mode}</td>
                                    <td>₹{totalValue.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            )}
        </>
    );
}

export default Orders;