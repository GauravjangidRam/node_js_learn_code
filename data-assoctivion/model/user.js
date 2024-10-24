const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/MinProjectApp');

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const user = mongoose.model('user', userSchema);

module.exports = user;