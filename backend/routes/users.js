const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// User routes
router.post('/register', userController.addUser); // Register a new user
router.post('/login', userController.loginUser); // Login route for users
router.get('/profile/:userId', userController.getUser); // Get a user's profile
router.put('/profile/:userId', userController.updateUser); // Update user profile
router.delete('/profile/:userId', userController.deleteUser); // Delete a user


module.exports = router;
