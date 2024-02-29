const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const resumeController = require('../controllers/resume-controller'); // Assuming you have a separate controller for resumes

// User routes
router.post('/register', userController.addUser); // Register a new user
router.post('/login', userController.loginUser); // Login route for users
router.get('/profile/:userId', userController.getUser); // Get a user's profile
router.put('/profile/:userId', userController.updateUser); // Update user profile
router.delete('/profile/:userId', userController.deleteUser); // Delete a user

// Resume routes for a user
router.post('/resume', resumeController.addResume); // Create a new resume
router.get('/resumes/:userId', resumeController.getUserResumes); // Get all resumes for a user
router.get('/resume/:resumeId', resumeController.getResume); // Get a specific resume
router.put('/resume/:resumeId', resumeController.updateResume); // Update a specific resume
router.delete('/resume/:resumeId', resumeController.deleteResume); // Delete a specific resume

module.exports = router;
