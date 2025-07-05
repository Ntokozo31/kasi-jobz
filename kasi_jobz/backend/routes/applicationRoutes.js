// appctionRoutes - Handles application-related routes for the API.

// Import expres
const express = require('express');

// Import router
const router = express.Router();

// Import controller function
const { createApplication, getApplicationsById } = require('../controllers/applicationController');

// Route to create and save new application
router.post('/', createApplication);

// Route to get applications of a specific job by jobId
router.get('/:jobId', getApplicationsById);

// Export
module.exports = router