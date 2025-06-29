// Import express.
const express = require('express');

// Initialize router
const router = express.Router();

router.post('/api/users', (req, res) => {
    res.status(200).json({ message: "User created successfully"})
})


// Export 
module.exports = router;