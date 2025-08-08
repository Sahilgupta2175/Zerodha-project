import React, {useState, useEffect} from 'react';
import './Positions.css';

function Positions() {
    const [allPositions, setAllPositions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                setLoading(true);
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
                const response = await fetch(`${backendUrl}/allPositions`);
                if (response.ok) {
                    const data = await response.json();
                    
                    // Remove duplicates on frontend as additional safety
                    const uniquePositions = data.reduce((acc, current) => {
                        const existingIndex = acc.findIndex(position => position.name === current.name);
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
                    
                    setAllPositions(uniquePositions);
                }
            } catch {
                setAllPositions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

    return (
        <>
            <h3 className="title">
                Positions ({allPositions.length})
                {loading && <span style={{fontSize: '12px', color: '#666'}}> (Loading...)</span>}
            </h3>
            <div className="order-table">
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Instrument</th>
                        <th>Qty.</th>
                        <th>Avg.</th>
                        <th>LTP</th>
                        <th>P&L</th>
                        <th>Chg.</th>
                    </tr>

                    {allPositions.map((stock, index) => {
                        const currVal = stock.price * stock.qty;
                        const isProfit = currVal - stock.avg * stock.qty >= 0.0;
                        const profitClass = isProfit ? "profit" : "loss";
                        const dayClass = stock.isLoss ? "loss" : "profit";

                        return (
                            <tr key={stock._id || `position-${index}`}>
                                <td>{stock.product}</td>
                                <td>{stock.name}</td>
                                <td>{stock.qty}.</td>
                                <td>{stock.avg.toFixed(2)}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td className={profitClass}>{(currVal - stock.avg * stock.qty).toFixed(2)}</td>
                                <td className={dayClass}>{stock.day}</td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        </>
    );
}

export default Positions;