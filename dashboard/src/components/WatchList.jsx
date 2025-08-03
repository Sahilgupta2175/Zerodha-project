import React from 'react';
import './WatchList.css';
import { watchlist } from '../data/data';
import WatchListItem from './WatchListItem'

function WatchList() {
    return (
        <div className="watchlist-container">
            <div className="search-container">
                <input
                    type="text" name="search" id="search" placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx" className="search" />
                <span className="counts"> {watchlist.length} / 50</span>
            </div>
            <ul className="list">
                {
                    watchlist.map((stock, index) => {
                        return <WatchListItem stock={stock} key={index} />
                    })
                }
            </ul>
        </div>
    );
}

export default WatchList;