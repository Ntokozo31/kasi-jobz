// jobRoutes - Handles job-related routes for the API.

// import express.
const express = require('express');

// Import controller functions
const { 
    createJob,
    getJobs,
    updateJob,
    getJobById,
    deleteJobById,
    getJobsByPoster
} = require('../controllers/jobControllers');

// Initialize router
const router = express.Router();

// Route to create and save a new job
router.post('/', createJob);

// Route to retrieve all jobs sorted by newest first
router.get('/', getJobs);

// Route to update job by Id
router.put('/:id', updateJob);

// Route to retrieve job by Id.
router.get('/:id', getJobById);

// Routes to get jobs by poster
router.get('/poster/:posterId', getJobsByPoster);

// Route to delete job by Id
router.delete('/:id', deleteJobById);

// Export
module.exports = router