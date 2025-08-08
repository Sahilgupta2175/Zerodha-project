import React from 'react';
import './TopBar.css';
import Menu from "./Menu";

function TopBar() {
    // Debug environment variables
    console.log('Environment variables check:', {
        BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE
    });

    return (
        <div className="topbar-container">
            <div className="indices-container">
                <div className="nifty">
                    <p className="index">NIFTY 50</p>
                    <p className="index-points">{100.2} </p>
                    <p className="percent"> </p>
                </div>
                <div className="sensex">
                    <p className="index">SENSEX</p>
                    <p className="index-points">{100.2}</p>
                    <p className="percent"></p>
                </div>
            </div>
            <Menu />
        </div>
    );
}

export default TopBar;