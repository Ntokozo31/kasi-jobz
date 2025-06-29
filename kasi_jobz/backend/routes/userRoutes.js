// Import express.
const express = require('express');

// Initialize router.
const router = express.Router();

// Import User model.
const User = require('../models/user');

// Create and save new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ message: "User created successfully", user: userObj})
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error: error.message})
    }
});

// Get users.
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message})
    }
});


// Export. 
module.exports = router;