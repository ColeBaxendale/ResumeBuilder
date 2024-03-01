const User = require('../models/user'); // Adjust the path as necessary
const { validationResult } = require('express-validator');


exports.addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Extract email and password from request body
        const { email, password } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "User already exists with this email." });
        }
        // Create a new user instance and save to the database
        const user = new User({ email, password });
        await user.save();
        // Respond with the created user (excluding the password)
        const userResponse = { _id: user._id, email: user.email };
        res.status(201).send(userResponse);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send({ message: "Failed to register user." });
    }
};


exports.loginUser = async(req,res) => {
    console.log('loginUser Method');
}

exports.getUser = async(req,res) => {
    console.log('getUser Method');
}

exports.updateUser = async(req,res) => {
    console.log('updateUser Method');
}

exports.deleteUser = async(req,res) => {
    console.log('deleteUser');
}

