const mongoose = require('mongoose');

const userPost = new mongoose.Schema({
    username: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    date : [{
        type: Date,
        default: Date.now
    }],
   content: String,
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const Post = mongoose.model('post', userPost);

module.exports = Post;