const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post: String,
    userdata : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date : {
        type : Date,
        default : Date.now
    },
});

module.exports = mongoose.model('post',postSchema);