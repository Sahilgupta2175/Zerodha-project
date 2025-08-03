import React, {useState} from 'react';
import './WatchListItem.css';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';

function WatchListItem({stock}) {
    const [showWatchListActions, setShowWatchListActions] = useState(false);

    const handleMouseEnter = (event) => {
        setShowWatchListActions(true);
    }

    const handleMouseLeave = (event) => {
        setShowWatchListActions(false);
    }

    return (
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="item">
                <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
                <div className="item-info">
                    <span className='percent'>{stock.percent}</span>
                    {stock.isDown ? (<KeyboardArrowDown className="down" />) : (<KeyboardArrowUp className="up" />)}
                    <span className="price">{stock.price}</span>
                </div>
            </div>
        </li>
    );
}

export default WatchListItem;