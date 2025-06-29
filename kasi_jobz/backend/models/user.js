// Import mongoose.
const mongoose = require('mongoose');

// Define user Schema.
const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

// Create user Model.
const User = new mongoose.model('User', userSchema);

// Export.
module.exports = User;