// Import express.
const express = require('express');

// Import cors.
const cors = require('cors');

// Import dotenv.
require('dotenv').config();

// Initialize express app.
const app = express();

// Configure CORS to allow requests from any origin.
app.use(cors());

// Parse JSON bodies.
app.use(express.json());

// Route for testing the API. 
app.get('/api/health', (req, res) => {
    res.status(200).json({message: 'KasiJobz API is up and running'});
});

// Start server on environment port or default to 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});