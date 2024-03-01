/**
 * Filename: server.js
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [January 2024]
 * Version: 1.0
 * 
 * Description: 
 * This file sets up and starts an Express server for a stock trading application. It includes configurations 
 * for MongoDB database connection, middleware for request parsing and CORS, and route handlers for user and stock 
 * functionalities.
 * 
 * Major Functions:
 * - Configures environment variables.
 * - Establishes connection to MongoDB.
 * - Sets up middleware for JSON parsing, URL-encoded data parsing, and cookie parsing.
 * - Registers routes for user and stock operations.
 * - Starts the Express server on a defined port.
 * 
 */

// Load environment variables from .env file
require('dotenv').config();

// Importing required modules
const express = require('express'); // Express framework for creating the server
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions
const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const cors = require('cors'); // Middleware to enable CORS (Cross-Origin Resource Sharing)
const userRoutes = require('./routes/users'); // Import user-related routes

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Enable cookie parsing for incoming requests
app.use(cookieParser());

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected')) // Log successful connection to MongoDB
    .catch(err => console.error('MongoDB connection error:', err)); // Log any MongoDB connection errors

// Middleware for parsing JSON and URL-encoded data in requests
app.use(express.json()); // Parses JSON data in requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data in requests

// Registering route handlers
app.use('/api/users', userRoutes); // User-related API routes

// Start the server on the specified PORT
const PORT = process.env.PORT || 3000; // Use environment variable for PORT, or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log the port number on which the server is running
});