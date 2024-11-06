// user.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MinProjectApp');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profile: {
        type: String,
        // default: "defaultProfile.png" 
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
