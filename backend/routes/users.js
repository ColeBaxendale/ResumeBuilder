const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { body, validationResult } = require('express-validator');


// User routes

router.post('/register', [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password')
      .isLength({ min: 8, max: 100 })
      .withMessage('Password must be at least 8 characters long and no more than 100 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ], userController.addUser);
router.post('/login', userController.loginUser); // Login route for users



// TO DO 
router.get('/profile/:userId', userController.getUser); // Get a user's profile
router.put('/profile/:userId', userController.updateUser); // Update user profile
router.delete('/profile/:userId', userController.deleteUser); // Delete a user


module.exports = router;
