import React, { useState, useEffect } from 'react';
import './Summary.css';
import axios from 'axios';

function Summary() {
    const [user, setUser] = useState({ username: 'User' });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/verify`,
                    {},
                    { withCredentials: true }
                );
                
                if (response.data.status) {
                    setUser({ username: response.data.user });
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);
    return (
        <>
            <div className="username">
                <h6>Hi, {user.username}!</h6>
                <hr className="divider" />
            </div>
            <div className="section">
                <span>
                    <p>Equity</p>
                </span>
                <div className="data">
                    <div className="first">
                        <h3>3.74k</h3>
                        <p>Margin available</p>
                    </div>
                    <hr />
                    <div className="second">
                        <p>
                            Margins used <span>0</span>{" "}
                        </p>
                        <p>
                            Opening balance <span>3.74k</span>{" "}
                        </p>
                    </div>
                </div>
                <hr className="divider" />
            </div>
            <div className="section">
                <span>
                    <p>Holdings (13)</p>
                </span>
                <div className="data">
                    <div className="first">
                        <h3 className="profit">
                            1.55k <small>+5.20%</small>{" "}
                        </h3>
                        <p>P&L</p>
                    </div>
                    <hr />
                    <div className="second">
                        <p>
                            Current Value <span>31.43k</span>{" "}
                        </p>
                        <p>
                            Investment <span>29.88k</span>{" "}
                        </p>
                    </div>
                </div>
                <hr className="divider" />
            </div>

            <div className="section">
                <span>
                    <p>Live Market Overview</p>
                </span>
                <div style={{ padding: '10px', color: '#666', fontSize: '12px' }}>
                    Market data unavailable
                </div>
            </div>
        </>
    );
}

export default Summary;