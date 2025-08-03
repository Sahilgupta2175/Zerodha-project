import React, {useState} from 'react';
import './WatchListItem.css';
import {KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import WatchListActions from './WatchListActions';

function WatchListItem({stock}) {
    const [showWatchListActions, setShowWatchListActions] = useState(false);

    const handleMouseEnter = () => {
        setShowWatchListActions(true);
    }

    const handleMouseLeave = () => {
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
            {showWatchListActions && <WatchListActions uid={stock.name} />}
        </li>
    );
}

export default WatchListItem;