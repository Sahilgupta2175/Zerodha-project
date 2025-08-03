import React, { useState } from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

function Menu() {
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);

    const handleMenuClick = (index) => {
        setSelectedMenu(index);
    }

    const handleProfileClick = () => {
        setIsProfileDropDownOpen(!isProfileDropDownOpen);
    }

    const menuClass = "menu";
    const activeMenuClasss = "menu selected";

    return (
        <div className="menu-container">
            <img src="logo.png" style={{ width: "50px" }} />
            <div className="menus">
                <ul>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/" onClick={() => {handleMenuClick(0)}}>
                            <p className={selectedMenu === 0 ? activeMenuClasss : menuClass}>Dashboard</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/orders" onClick={() => {handleMenuClick(1)}}>
                            <p className={selectedMenu === 1 ? activeMenuClasss : menuClass}>Orders</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/holdings" onClick={() => {handleMenuClick(2)}}>
                            <p className={selectedMenu === 2 ? activeMenuClasss : menuClass}>Holdings</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/positions" onClick={() => {handleMenuClick(3)}}>
                            <p className={selectedMenu === 3 ? activeMenuClasss : menuClass}>Positions</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/funds" onClick={() => {handleMenuClick(4)}}>
                            <p className={selectedMenu === 4 ? activeMenuClasss : menuClass}>Funds</p>
                        </Link>
                    </li>
                    <li>
                        <Link style={{textDecoration:"none"}} to="/apps" onClick={() => {handleMenuClick(5)}}>
                            <p className={selectedMenu === 5 ? activeMenuClasss : menuClass}>Apps</p>
                        </Link>
                    </li>
                </ul>
                <hr />
                <div className="profile" onClick={handleProfileClick}>
                    <div className="avatar">ZU</div>
                    <p className="username">USERID</p>
                </div>
                {isProfileDropDownOpen}
            </div>
        </div>
    );
}

export default Menu;