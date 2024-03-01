const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { body, validationResult } = require('express-validator');


// User routes

router.post('/register', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ], userController.addUser);
router.post('/login', userController.loginUser); // Login route for users
router.get('/profile/:userId', userController.getUser); // Get a user's profile
router.put('/profile/:userId', userController.updateUser); // Update user profile
router.delete('/profile/:userId', userController.deleteUser); // Delete a user


module.exports = router;
