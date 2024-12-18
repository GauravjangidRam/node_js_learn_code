const express = require('express');
const app = express();
const userModel = require('./models/user')
const PostModel = require('./models/poste')
app.get('/',async(req,res)=>{
   let user = await userModel.create({
        username : "gaurav",
        email : "gaurav@gmail.com",
        password : "1234567890",
    });
    res.send(user);
    // let post = await postModel.
});
app.get('/post', async (req, res) => {
    let post = await PostModel.create({
        post: "nice product review",
        userdata: "6713f4d9fe74d5495053de8a"
    });
    let user = await userModel.findOne({ _id: "6713f4d9fe74d5495053de8a" });
    
    // If the user exists, push the post into their posts array
    if (user) {
        // Assuming user has an array field called `posts` to store posts
        user.post = user.post || [];
        user.post.push(post._id); // store the post's ObjectId, not the whole object
        await user.save();
    }

    res.send({ post, user });
});


app.listen(3000,(err, res)=>{
    if(err) throw err;
    console.log('Server running on port 3000');
})