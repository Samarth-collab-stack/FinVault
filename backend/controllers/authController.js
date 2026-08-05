const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if(!fullName || !email || !password) {
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
            fullName,
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
        console.error(error);
        return res.status(500).json({ success:false, message: "Internal Server Error" });
    }
} 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Step 2: Find user
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Step 3: Compare password
        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Step 4: Generate JWT
        const token = jwt.sign(
            {
                id: existingUser._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Step 5: Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


module.exports = {
  signup,
  login,
};