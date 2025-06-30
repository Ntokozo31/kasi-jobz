// import express.
const express = require('express');

// Initialize router
const router = express.Router();

// Import Job 
const Job = require('../models/job');

// Route to create and save a new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body)
        await job.save()
        res.status(200).json({ message: "Job successfully saved", job})
    } catch (error) {
        res.status(500).json({ message: "Error tying to save job", error: error.message})
    }
});

// Route to retrieve all jobs sorted by newest first
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error trying to retrieve jobs", error: error.message})
    }
})

// Export
module.exports = router