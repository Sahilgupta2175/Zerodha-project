import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                console.log('Checking user authentication...');
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/verify`,
                    {},
                    { withCredentials: true }
                );
                
                console.log('Auth check response:', response.data);
                
                if (response.data.status) {
                    setIsAuthenticated(true);
                } else {
                    console.log('User not authenticated, redirecting to login...');
                    // Redirect to login page
                    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                // Redirect to login page on error
                window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                <p>Redirecting to login...</p>
                <p>If you're not redirected, <a href={`${import.meta.env.VITE_FRONTEND_URL}/login`}>click here</a></p>
            </div>
        );
    }

    return (
        <>
            <TopBar />
            <Dashboard />
        </>
    );
}

export default Home;