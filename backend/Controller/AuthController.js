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
            return res.json({message:'All fields are required'});
        }

        const user = await User.findOne({ email });
        const auth = await bcrypt.compare(password,user.password);

        if(!user || !auth){
            return res.json({message:'Incorrect password or email' }); 
        }

        const token = secretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User logged in successfully", success: true });
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = { signup, login };