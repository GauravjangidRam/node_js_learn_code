const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1.27017/userDefaultData');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // Ensure this is defined correctly
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
