// import express.
const express = require('express');

// Initialize router
const router = express.Router();

// Import Job 
const Job = require('../models/job');

// Job router
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body)
        await job.save()
        res.status(200).json({ message: "Job successfully saved", job})
    } catch (error) {
        res.status(500).json({ message: "Error tying to save job", error: error.message})
    }
});

// Export
module.exports = router