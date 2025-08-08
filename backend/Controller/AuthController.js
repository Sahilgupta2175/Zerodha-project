const User = require('../model/User');
const secretToken = require('../utils/SecretToken');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
    try {
        console.log("Signup attempt - Request body:", req.body);
        const { email, password, username, createdAt } = req.body;
        
        if (!email || !password || !username) {
            console.log("Missing required fields");
            return res.status(400).json({
                message: 'Email, password, and username are required',
                success: false
            });
        }
        
        console.log("Checking for existing user:", email);
        const exisitngUser = await User.findOne({email});

        if(exisitngUser) {
            console.log("User already exists:", email);
            return res.status(409).json({message: 'User already exists', success: false});
        }

        console.log("Creating new user:", email);
        const user = await User.create({ email, password, username, createdAt });
        const token = secretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        console.log("User created successfully:", email);
        res.status(201).json({message: "User signed in successfully", success: true, user});
        next();
    }
    catch(err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error during signup", success: false });
    }
}

const login = async (req, res, next) => {
    try {
        console.log("Login attempt - Request body:", { email: req.body.email, hasPassword: !!req.body.password });
        
        const { email, password } = req.body;
        if(!email || !password ){
            console.log("Missing email or password");
            return res.status(400).json({message:'All fields are required', success: false});
        }

        console.log("Searching for user:", email);
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("User not found:", email);
            return res.status(404).json({message:'User not found. Please sign up first.', success: false});
        }

        console.log("User found, verifying password");
        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            console.log("Password verification failed for:", email);
            return res.status(401).json({message:'Incorrect password', success: false}); 
        }

        console.log("Password verified, generating token");
        const token = secretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        console.log("Login successful for:", email);
        res.status(200).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.error("Login error details:", error);
        res.status(500).json({ message: "Internal server error during login", success: false });
    }
}

module.exports = { signup, login };