const mongoose = require('mongoose'); // Fix the typo here

// Define a simple user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create a model from the schema
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
