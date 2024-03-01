const User = require('../models/user'); // Adjust the path as necessary
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a token. Replace 'yourSecretKey' with a real secret key.
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });


        res.send({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Failed to login' });
    }
};

exports.getUser = async(req,res) => {
    console.log('getUser Method');
}

exports.updateUser = async(req,res) => {
    console.log('updateUser Method');
}

exports.deleteUser = async(req,res) => {
    console.log('deleteUser');
}

