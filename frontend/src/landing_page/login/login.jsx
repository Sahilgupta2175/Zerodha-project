import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./login.css";

function Login() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});

    const { email, password } = inputValue;

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        if (!password) {
            newErrors.password = "Password is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleError = (err) => {
        toast.error(err, {
            position: "top-right"
        });
    };

    const handleSuccess = (msg) => {
        toast.success(msg, {
            position: "top-right"
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            console.log("Attempting login with:", { email, password: "***" });
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/login`, 
                { ...inputValue }, 
                { withCredentials: true }
            );
            
            console.log("Login response:", data);
            const { success, message } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    window.location.href = 'https://zerodha-dashboard-sg.vercel.app';
                }, 1000);
            } else {
                if (message && message.toLowerCase().includes('user not found') || 
                    message && message.toLowerCase().includes('no user found') ||
                    message && message.toLowerCase().includes('incorrect password or email')) {
                    
                    handleError("Account not found. Redirecting to signup...");
                    setTimeout(() => {
                        navigate('/signup');
                    }, 2000);
                } else {
                    handleError(message);
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error message:", error.message);
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to login. Please check your credentials.";
            
            if (error.response?.status === 404 || 
                errorMessage.toLowerCase().includes('user not found') ||
                errorMessage.toLowerCase().includes('no user found') ||
                errorMessage.toLowerCase().includes('user does not exist')) {
                
                handleError("Account not found. Redirecting to signup page...");
                setTimeout(() => {
                    navigate('/signup');
                }, 2000);
            } else {
                handleError(errorMessage);
                alert(`Login failed: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img 
                        src="/Images/logo.svg" 
                        alt="Zerodha" 
                        className="logo"
                    />
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">
                        Sign in to your account to continue trading
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email address"
                            value={email}
                            onChange={handleOnChange}
                        />
                        {errors.email && (
                            <div className="field-error">
                                ⚠️ {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={handleOnChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? "👁️‍🗨️" : "👁️"}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="field-error">
                                ⚠️ {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <div className="login-notice">
                        <small>
                            📌 Don't have an account? You'll be automatically redirected to signup if your email isn't found.
                        </small>
                    </div>
                    Don't have an account?{' '}
                    <Link to="/signup" className="signup-link">
                        Create one here
                    </Link>
                </div>
            </div>
            
            <ToastContainer />
        </div>
    );
}

export default Login;
