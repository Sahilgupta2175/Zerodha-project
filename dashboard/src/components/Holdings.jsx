import React, { useState, useEffect } from 'react';
import './Holdings.css';
import { HoldingsBarChart, SimpleHoldingsBarChart } from './HoldingsBarChart.jsx';

function Holdings() {
    const [allHoldings, setAllHoldings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDetailedChart, setShowDetailedChart] = useState(false);
    const [dataSource, setDataSource] = useState('database'); // 'database' or 'live'

    useEffect(() => {
        fetchDatabaseHoldings();
    }, []);

    const fetchDatabaseHoldings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/allHoldings`);
            if (response.ok) {
                const data = await response.json();
                
                // Remove duplicates on frontend as additional safety
                const uniqueHoldings = data.reduce((acc, current) => {
                    const existingIndex = acc.findIndex(holding => holding.name === current.name);
                    if (existingIndex === -1) {
                        acc.push(current);
                    } else {
                        // Keep the one with higher _id (more recent)
                        if (current._id > acc[existingIndex]._id) {
                            acc[existingIndex] = current;
                        }
                    }
                    return acc;
                }, []);
                
                setAllHoldings(uniqueHoldings);
                setDataSource('database');
            }
        } catch {
            setAllHoldings([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAllStocks = async () => {
        try {
            setLoading(true);
            
            const liveHoldings = [
                { name: 'RELIANCE INDUSTRIES', symbol: 'RELIANCE', price: 2945.60, change: '+1.2%' },
                { name: 'TATA CONSULTANCY SERVICES', symbol: 'TCS', price: 3142.30, change: '+0.8%' },
                { name: 'INFOSYS LIMITED', symbol: 'INFY', price: 1528.45, change: '-0.5%' },
                { name: 'HDFC BANK LIMITED', symbol: 'HDFCBANK', price: 1652.80, change: '+2.1%' },
                { name: 'BHARTI AIRTEL LIMITED', symbol: 'BHARTIARTL', price: 1015.25, change: '+1.8%' },
                { name: 'INDIAN TOBACCO COMPANY', symbol: 'ITC', price: 392.70, change: '-0.3%' },
                { name: 'STATE BANK OF INDIA', symbol: 'SBIN', price: 515.90, change: '+0.9%' },
                { name: 'WIPRO LIMITED', symbol: 'WIPRO', price: 408.15, change: '-1.2%' },
                { name: 'KOTAK MAHINDRA BANK', symbol: 'KOTAKBANK', price: 1745.50, change: '+1.5%' },
                { name: 'ASIAN PAINTS LIMITED', symbol: 'ASIANPAINT', price: 2835.40, change: '+0.7%' }
            ].map((stock, index) => ({
                _id: `live_${index}`,
                name: stock.name,
                symbol: stock.symbol,
                qty: Math.floor(Math.random() * 100) + 1,
                avg: stock.price * (0.92 + Math.random() * 0.16),
                price: stock.price + (Math.random() - 0.5) * (stock.price * 0.03),
                net: stock.change,
                day: (Math.random() > 0.6 ? '+' : '-') + (Math.random() * 3).toFixed(2) + '%',
                isLoss: stock.change.startsWith('-'),
                isLiveData: true,
                lastUpdated: new Date().toISOString()
            }));
            
            setAllHoldings(liveHoldings);
            setDataSource('live');
                
        } catch {
            setAllHoldings([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h3 className="title">
                Holdings ({allHoldings.length}) 
                <span style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}>
                    {dataSource === 'database' ? '(Database)' : '(Live Demo)'}
                </span>
                {loading && <span style={{fontSize: '12px', color: '#666'}}> (Loading...)</span>}
            </h3>

            {/* Control buttons */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                    onClick={loadAllStocks}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Load All Stocks (Live)
                </button>
                <button 
                    onClick={fetchDatabaseHoldings}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Load Database Holdings
                </button>
            </div>

            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Qty.</th>
                            <th>Avg. cost</th>
                            <th>LTP</th>
                            <th>Cur. val</th>
                            <th>P&L</th>
                            <th>Net chg.</th>
                            <th>Day chg.</th>
                        </tr>
                    </thead>
                    <tbody>
                    {allHoldings.map((stock, index) => {
                        const currVal = stock.price * stock.qty;
                        const isProfit = currVal - stock.avg * stock.qty >= 0.0;
                        const profitClass = isProfit ? "profit" : "loss";
                        const dayClass = stock.isLoss ? "loss" : "profit";

                        return (
                            <tr key={stock._id || `stock-${index}`} style={{ 
                                backgroundColor: stock.isLiveData ? '#f0fff0' : 'white',
                                borderLeft: stock.isLiveData ? '3px solid #28a745' : 'none'
                            }}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {stock.name}
                                        {stock.isLiveData && (
                                            <span style={{
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                fontSize: '9px',
                                                padding: '2px 5px',
                                                borderRadius: '8px',
                                                textTransform: 'uppercase'
                                            }}>
                                                LIVE
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>{stock.qty}</td>
                                <td>{stock.avg.toFixed(2)}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td>{currVal.toFixed(2)}</td>
                                <td className={profitClass}>{(currVal - stock.avg * stock.qty).toFixed(2)}</td>
                                <td className={profitClass}>{stock.net}</td>
                                <td className={dayClass}>{stock.day}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="row">
                <div className="col">
                    <h5>
                        {allHoldings.length > 0 
                            ? allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0).toFixed(2).split('.')[0]
                            : '0'
                        }.<span>
                        {allHoldings.length > 0 
                            ? allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0).toFixed(2).split('.')[1]
                            : '00'
                        }</span>
                    </h5>
                    <p>Total investment</p>
                </div>
                <div className="col">
                    <h5>
                        {allHoldings.length > 0 
                            ? allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0).toFixed(2).split('.')[0]
                            : '0'
                        }.<span>
                        {allHoldings.length > 0 
                            ? allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0).toFixed(2).split('.')[1]
                            : '00'
                        }</span>
                    </h5>
                    <p>Current value</p>
                </div>
                <div className="col">
                    <h5>
                        {allHoldings.length > 0 
                            ? (allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0) - allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0)).toFixed(2)
                            : '0.00'
                        } 
                        ({allHoldings.length > 0 && allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0) > 0
                            ? ((allHoldings.reduce((sum, stock) => sum + (stock.price * stock.qty), 0) / allHoldings.reduce((sum, stock) => sum + (stock.avg * stock.qty), 0) - 1) * 100).toFixed(2)
                            : '0.00'
                        }%)
                    </h5>
                    <p>P&L</p>
                </div>
            </div>

            {/* Bar Chart Section */}
            {allHoldings.length > 0 && (
                <div style={{ margin: '30px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0, color: '#333' }}>📊 Holdings Performance Chart</h4>
                        <button 
                            onClick={() => setShowDetailedChart(!showDetailedChart)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: showDetailedChart ? '#28a745' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {showDetailedChart ? 'Simple View' : 'Detailed View'}
                        </button>
                    </div>
                    {showDetailedChart ? (
                        <HoldingsBarChart holdings={allHoldings} />
                    ) : (
                        <SimpleHoldingsBarChart holdings={allHoldings} />
                    )}
                </div>
            )}
        </>
    );
}

export default Holdings;
