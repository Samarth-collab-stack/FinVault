const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if(!fullname || !email || !password) {
            return res.status(400).json({ success:false, message: "Please provide all required fields" });
        }
        //Validation
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ success:false, message: "User already exists" });
        }
        // HASHING PASSWORD AND CREATING USER   
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });
        await newUser.save();
        // GENERATING JWT TOKEN
        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );
        return res.status(201).json({ 
            success:true, 
            message: "User created successfully", 
            token });
    }
    catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ success:false, message: "Internal Server Error" });
    }
} 


module.exports = {
  signup,
};