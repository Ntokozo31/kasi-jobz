// userRoutes.js - Handles user-related routes for the API.

// Import express.
const express = require('express');

// Initialize router.
const router = express.Router();

// Import controller functions
const { createUser, getUsers } = require('../controllers/userController');

// Route to create and save a new user.
router.post('/', createUser);

// Route to get all users, excluding password.
router.get('/', getUsers);


// Export. 
module.exports = router;