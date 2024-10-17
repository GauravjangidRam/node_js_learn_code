const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post: String,
    userdata : String,
    date : {
        type : Date,
        default : Date.now
    },
    post: String
});

module.exports = mongoose.model('user',userSchema);