// userController.js - Handles user-related controller function

// Imoprt User Model
const User = require('../models/user');

// CreaterUser function - creates a new user and excludes password
const createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ message: "User created successfully", user: userObj })
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error: error.message })
    }
};

// getUser function - get all users 
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message })
    }
};


// Export
module.exports = {
    createUser,
    getUsers
}