import React, { useContext } from 'react';
import './WatchListActions.css';
import {Tooltip, Grow} from '@mui/material';
import { BarChartOutlined, MoreHoriz } from '@mui/icons-material';
import { GeneralContext } from './GeneralContext';

function WatchListActions({uid}) {
    const { openBuyWindow } = useContext(GeneralContext);

    const handleBuyClick = () => {
        openBuyWindow(uid);
    };

    const handleSellClick = () => {
        openBuyWindow(uid);
    };

    return (
        <span className='actions'>
            <span>
                <Tooltip title='Buy (B)' placement='top' arrow TransitionComponent={Grow}>
                    <button className='buy' onClick={handleBuyClick}>Buy</button>
                </Tooltip>
                <Tooltip title='Sell (S)' placement='top' arrow TransitionComponent={Grow}>
                    <button className='sell' onClick={handleSellClick}>Sell</button>
                </Tooltip>
                <Tooltip title='Analytics (A)' placement='top' arrow TransitionComponent={Grow}>
                    <button className='action'><BarChartOutlined className='icon' /></button>
                </Tooltip>
                <Tooltip title='More' placement='top' arrow TransitionComponent={Grow}>
                    <button><MoreHoriz className='icon'/></button>
                </Tooltip>
            </span>
        </span>
    );
}

export default WatchListActions;