import React from 'react';
import { Route, Routes } from "react-router-dom";
import './Dashboard.css';
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import GeneralContent from './GeneralContent';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <GeneralContent>
                <WatchList />
            </GeneralContent>
            <div className="content">
                <Routes>
                    <Route index element={<Summary />} />
                    <Route path="/" element={<Summary />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/holdings" element={<Holdings />} />
                    <Route path="/positions" element={<Positions />} />
                    <Route path="/funds" element={<Funds />} />
                    <Route path="/apps" element={<Apps />} />
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;