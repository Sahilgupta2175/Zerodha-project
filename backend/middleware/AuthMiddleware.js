require('dotenv').config();
const User = require("../model/User");
const jwt = require('jsonwebtoken');
const connectDB = require('../config/mongoConnection');

const userVerification = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1] || req.body.token;
    
    if (!token) {
        return res.json({ status: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if(err) {
            console.log("JWT verification error:", err.message);
            return res.json({ status: false, message: "Invalid token" });
        }
        
        try {
            // Ensure database connection
            await connectDB();
            
            const user = await User.findById(data.id);
            if (user) {
                return res.json({ 
                    status: true, 
                    user: user.username,
                    userId: user._id,
                    email: user.email 
                });
            } else {
                return res.json({ status: false, message: "User not found" });
            }
        } catch (error) {
            console.log("Database error:", error);
            return res.json({ status: false, message: "Database error" });
        }
    });
}

module.exports = userVerification;