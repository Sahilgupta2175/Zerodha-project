import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GeneralContext } from "./GeneralContext";
import './BuyActionsWindow.css';

function BuyActionsWindow({ uid, price }) {
    const [stockQuantity, setStockQuantity] = useState(1);
    const [stockPrice, setStockPrice] = useState(0.0);
    const [actualPrice, setActualPrice] = useState(0.0);
    const [priceVariation, setPriceVariation] = useState(0);
    const { closeBuyWindow } = useContext(GeneralContext);

    useEffect(() => {
        if (price) {
            setActualPrice(parseFloat(price));
            setStockPrice(parseFloat(price));
        } else {
            setActualPrice(100);
            setStockPrice(100);
        }
    }, [price]);

    const marginRequired = (stockPrice * stockQuantity * 0.20).toFixed(2);

    const handlePriceChange = (variation) => {
        const newPrice = actualPrice * (1 + variation / 100);
        setStockPrice(newPrice);
        setPriceVariation(variation);
    };

    const priceAdjustments = [
        { label: "-5%", value: -5 },
        { label: "-2%", value: -2 },
        { label: "-1%", value: -1 },
        { label: "Market", value: 0 },
        { label: "+1%", value: 1 },
        { label: "+2%", value: 2 },
        { label: "+5%", value: 5 }
    ];

    const handleBuyClick = async () => {
        try {
            if (!stockQuantity || stockQuantity <= 0) {
                alert("Please enter a valid quantity.");
                return;
            }
            
            if (!stockPrice || stockPrice <= 0) {
                alert("Please enter a valid price.");
                return;
            }
            
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newOrder`, {
                name: uid,
                qty: stockQuantity,
                price: stockPrice,
                mode: "BUY",
            });
            
            alert(`Buy order placed successfully! Bought ${stockQuantity} shares of ${uid} at ₹${stockPrice.toFixed(2)} each.`);
            closeBuyWindow();
        } catch (error) {
            if (error.response) {
                alert(`Failed to place buy order: ${error.response.data.error || error.response.data.message}`);
            } else {
                alert("Failed to place buy order. Please check your connection.");
            }
        }
    };

    const handleSellClick = async () => {
        try {
            const holdingsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allHoldings`);
            const holdings = holdingsResponse.data;
            
            const stockInHoldings = holdings.find(holding => holding.name === uid);
            
            if (!stockInHoldings) {
                alert(`You don't own any shares of ${uid}. Cannot sell.`);
                return;
            }
            
            if (stockInHoldings.qty < stockQuantity) {
                alert(`Insufficient quantity. You only have ${stockInHoldings.qty} shares of ${uid}, but trying to sell ${stockQuantity}.`);
                return;
            }
            
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/newOrder`, {
                name: uid,
                qty: stockQuantity,
                price: stockPrice,
                mode: "SELL",
            });
            
            alert(`Sell order placed successfully! Sold ${stockQuantity} shares of ${uid} at ₹${stockPrice.toFixed(2)} each.`);
            closeBuyWindow();
        } catch (error) {
            if (error.response) {
                alert(`Failed to place sell order: ${error.response.data.error || error.response.data.message}`);
            } else {
                alert("Failed to place sell order. Please check your connection.");
            }
        }
    };

    const handleCancelClick = () => {
        closeBuyWindow();
    };

    return (
        <div className="container" id="buy-window" draggable="true">
            <div className="header">
                <h3>{uid} <span>NSE</span></h3>
                <div className="market-options">
                    <span>Market Price: ₹{actualPrice.toFixed(2)}</span>
                    {priceVariation !== 0 && (
                        <span style={{ color: priceVariation > 0 ? '#22c55e' : '#ef4444' }}>
                            ({priceVariation > 0 ? '+' : ''}{priceVariation}%)
                        </span>
                    )}
                </div>
            </div>

            <div className="regular-order">
                <div className="inputs">
                    <fieldset>
                        <legend>Qty.</legend>
                        <input 
                            type="number"
                            name="qty"
                            id="qty"
                            min="1"
                            onChange={(e) => setStockQuantity(parseInt(e.target.value) || 1)}
                            value={stockQuantity}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Price</legend>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            step="0.05"
                            min="0.05"
                            onChange={(e) => {
                                const newPrice = parseFloat(e.target.value) || 0;
                                setStockPrice(newPrice);
                                const variation = actualPrice > 0 ? ((newPrice - actualPrice) / actualPrice) * 100 : 0;
                                setPriceVariation(variation);
                            }}
                            value={stockPrice.toFixed(2)}
                        />
                    </fieldset>
                </div>

                <div className="price-adjustments">
                    <label>Quick Price Adjust:</label>
                    <div className="adjustment-buttons">
                        {priceAdjustments.map((adj, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`adj-btn ${adj.value === priceVariation ? 'active' : ''}`}
                                onClick={() => handlePriceChange(adj.value)}
                            >
                                {adj.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="order-summary">
                    <div className="summary-row">
                        <span>Quantity:</span>
                        <span>{stockQuantity} shares</span>
                    </div>
                    <div className="summary-row">
                        <span>Price per share:</span>
                        <span>₹{stockPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Value:</span>
                        <span>₹{(stockPrice * stockQuantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="buttons">
                <span>Margin required ₹{marginRequired}</span>
                <div>
                    <button className="btn btn-blue" onClick={handleBuyClick}>
                        Buy
                    </button>
                    <button className="btn btn-red" onClick={handleSellClick}>
                        Sell
                    </button>
                    <button className="btn btn-grey" onClick={handleCancelClick}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyActionsWindow;
