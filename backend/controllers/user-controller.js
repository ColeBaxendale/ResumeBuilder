const User = require('../models/user'); 
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash'); 

/*
User Account CRUD Controller: 
Functions in this controller are designed to handle requests from the client side.
Each function is responsible for a specific task outlined below:
---------------------------------------------
+ addUser(): 
    - Create a new user account. 
       ~ Function to create a new user account
            @route POST /api/users/register
            @access Public
                @param {string} req.body.email
                @param {string} req.body.password
                req.body(email, password)
            201 @returns(user_id & user.email) 
            400 @returns("Please provide email and password.")
            400 @returns(errors.array)
            409 @returns("User already exists with this email.") 
            500 @returns("Failed to register user.") 

+ loginUser(): 
    - Login with correct user credintals
        ~ Function to login to a user's account
            @route POST /api/users/login
            @access Public
                @param {object} req.headers(JWT TOKEN)
                req.body(email, password)
            200 @returns(JWT TOKEN) 
            400 @returns("Please provide email and password.")
            404 @returns("User not found") 
            401 @returns("Invalid credentials") 
            500 @returns("Failed to login.") 

+ getUser():
    - Read a user account with JWT access (Return user_id & user.email)
        ~ Function to fetch a user's account object
            @route GET /api/users/profile/get
            @access Public
                @param {headers}
                req.headers(JWT TOKEN)
            200 @returns(User object without password) 
            403 @returns("Unauthorized")
            404 @returns("User not found") 
            500 @returns("Error retrieving user") 

+ updateUser():
    - Update a user account with JWT access (Return user_id & user.email)
        ~ Function to update a user's account
            @route PUT /api/users/profile/update
            @access Public
                @param {headers}
                req.headers(JWT TOKEN)
                @param {string} req.body.currentPassword
                @param {string} req.body.newPassword
                req.body(currentPassword, newPassword)
            200 @returns(User object without password) 
            400 @returns("Current password is incorrect")
            400 @returns("New password must be different than old")
            400 @returns("Please provide old password and new.")
            400 @returns("Current password is incorrect")
            403 @returns("Unauthorized")
            404 @returns("User not found") 
            500 @returns("Error updating user.") 

+ deleteUser():
    - Delete a user account with JWT access (Return success message)
        ~ Function to delete a user's account
            @route DELETE /api/users/profile/delete
            @access Public
                @param {headers}
                req.headers(JWT TOKEN)
            200 @returns("User deleted successfully") 
            403 @returns("Unauthorized")
            404 @returns("User not found") 
            500 @returns("Error deleting user.") 

---------------------------------------------
*/
exports.addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).send({ message: "Please provide email and password." });
        }

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

        if(!email || !password){
            return res.status(400).send({ message: "Please provide email and password." });
        }

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

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        // Optionally, exclude the password and other sensitive fields from the response
        const { password, ...userWithoutPassword } = user.toObject();
        res.send(userWithoutPassword);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving user' });
    }
};



exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        // Check if the current password is provided for verification
        if (req.body.currentPassword && req.body.newPassword) {
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                // The current password does not match the stored password
                return res.status(400).send({ message: "Current password is incorrect." });
            }

            // If the current password is correct, and the new password is different
            if (req.body.newPassword !== req.body.currentPassword) {
                user.password = req.body.newPassword; // Let the pre-save hook handle hashing
            } else{
                return res.status(400).send({ message: "New password must be different than the old." });
            }
        } else{
            return res.status(400).send({ message: "Please provide old password and new." });
        }

        if (infoChanged) {
            await user.save(); // Save changes, triggers the pre-save hook for password hashing if it's been changed
            const userResponse = _.omit(user.toObject(), ['password']);
            res.send(userResponse);
        } 
    } catch (error) {
        res.status(500).send({ message: "Error updating user."});
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting user' });
    }
};


