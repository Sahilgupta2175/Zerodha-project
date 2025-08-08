import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Orders.css';

function Orders() {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                console.log('Fetching orders from:', `${backendUrl}/allOrders`);
                const response = await fetch(`${backendUrl}/allOrders`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Orders data received:', data);
                    setAllOrders(data);
                } else {
                    console.error('Failed to fetch orders:', response.statusText);
                }
            } catch (error) {
                console.error('Orders fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <>
            <h3 className="title">
                Orders ({allOrders.length})
                {loading && <span style={{fontSize: '12px', color: '#666'}}> (Loading...)</span>}
            </h3>
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