import React, { useState, useEffect } from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu() {
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
    const [user, setUser] = useState({ username: 'Sahil Gupta', email: 'sahil@example.com' });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                if (backendUrl) {
                    const response = await axios.post(
                        `${backendUrl}/verify`,
                        {},
                        { 
                            withCredentials: true,
                            timeout: 5000
                        }
                    );
                    
                    if (response.data.status) {
                        setUser({
                            username: response.data.user,
                            email: response.data.email,
                            userId: response.data.userId
                        });
                    }
                }
            } catch {
                setUser({ username: 'User', email: 'user@example.com' });
            }
        };

        fetchUserInfo();
    }, []);

    const getInitials = (username) => {
        if (!username) return 'U';
        const names = username.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return username.substring(0, 2).toUpperCase();
    };

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
                    <div className="avatar">{getInitials(user.username)}</div>
                    <p className="username">{user.username}</p>
                </div>
                {isProfileDropDownOpen && (
                    <div className="profile-dropdown">
                        <p>{user.email}</p>
                        <button onClick={() => {
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            window.location.href = import.meta.env.VITE_FRONTEND_URL || '/';
                        }}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Menu;