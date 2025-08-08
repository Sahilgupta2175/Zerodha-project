import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./SignUp.css";

function SignUp() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { email, password, username } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
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
        
        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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
            console.log("Attempting signup with:", { email, username, password: "***" });
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/signup`, 
                { ...inputValue }, 
                { withCredentials: true }
            );
            
            console.log("Signup response:", data);
            const { success, message } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error message:", error.message);
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to create account. Please try again.";
            handleError(errorMessage);
            
            // Also show an alert for immediate visibility
            alert(`Signup failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <img 
                        src="/Images/logo.svg" 
                        alt="Zerodha" 
                        className="logo"
                    />
                    <h1 className="signup-title">Create Account</h1>
                    <p className="signup-subtitle">
                        Join thousands of traders and start your investment journey
                    </p>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={`form-input ${errors.username ? 'error' : ''}`}
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleOnChange}
                        />
                        {errors.username && (
                            <div className="field-error">
                                ⚠️ {errors.username}
                            </div>
                        )}
                    </div>

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
                                placeholder="Create a strong password"
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

                    <button
                        type="submit"
                        className={`signup-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '' : 'Create Account'}
                    </button>
                </form>

                <div className="signup-footer">
                    Already have an account?{' '}
                    <Link to="/login" className="login-link">
                        Sign in here
                    </Link>
                </div>
            </div>
            
            <ToastContainer />
        </div>
    );
}

export default SignUp;