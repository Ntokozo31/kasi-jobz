// appctionRoutes - Handles application-related routes for the API.

// Import expres
const express = require('express');

// Import router
const router = express.Router();

// Import controller function
const createApplication = require('../controllers/applicationController');

// Route to create and save new application
router.post('/', createApplication);

// Export
module.exports = router