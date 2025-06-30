// jobRoutes - Handles job-related routes for the API.

// import express.
const express = require('express');

// Import controller functions
const { createJob, getJobs } = require('../controllers/jobControllers');

// Initialize router
const router = express.Router();

// Route to create and save a new job
router.post('/', createJob);
    

// Route to retrieve all jobs sorted by newest first
router.get('/', getJobs);

// Export
module.exports = router