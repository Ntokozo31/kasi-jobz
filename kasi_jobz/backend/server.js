// server.js - Entry point for the kasiJobz backend API server

// Import express.
const express = require('express');

// Import cors for cross-origin requests
const cors = require('cors');

// Import mongoose for MongoDB connection
const mongoose = require('mongoose');

// Import dotenv.
require('dotenv').config();

// Initialize express app.
const app = express();

// Configure CORS to allow requests from any origin.
app.use(cors());

// Parse JSON bodies.
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');


// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Connect to MongoDB  database.
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error", error)) 

// Start server on environment port or default to 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`);
});