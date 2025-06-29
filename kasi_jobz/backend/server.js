// Import express.
const express = require('express');

// Import cors.
const cors = require('cors');

const mongoose = require('mongoose');

// Import dotenv.
require('dotenv').config();

// Initialize express app.
const app = express();

// Configure CORS to allow requests from any origin.
app.use(cors());

// Parse JSON bodies.
app.use(express.json());

// Import userRoutes
const userRoutes = require('./routes/userRoutes');

// Route for testing the API. 
app.get('/api/health', (req, res) => {
    res.status(200).json({message: 'KasiJobz API is up and running'});
});

// Use userRoutes
app.use(userRoutes);

// Connect to database.
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