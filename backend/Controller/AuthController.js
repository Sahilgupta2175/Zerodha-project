const User = require('../model/User');
const secretToken = require('../utils/SecretToken');
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        const { email, password, username, createdAt } = req.body;
        
        if (!email || !password || !username) {
            return res.status(400).json({
                message: 'Email, password, and username are required',
                success: false
            });
        }
        
        const exisitngUser = await User.findOne({email});

        if(exisitngUser) {
            return res.json({message: 'User already exists'});
        }

        const user = await User.create({ email, password, username, createdAt });
        const token = secretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({message: "User signed in successfully", success: true, user});
        next();
    }
    catch(err) {
        console.log(err);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password ){
            return res.status(400).json({message:'All fields are required', success: false});
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({message:'User not found. Please sign up first.', success: false});
        }
        
        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.status(401).json({message:'Incorrect password', success: false}); 
        }

        const token = secretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(200).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = { signup, login };