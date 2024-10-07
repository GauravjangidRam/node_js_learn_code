const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/',(req,res)=>{
    
    res.render('index');
});
app.get('/read',async (req,res)=>{
    let users = await User.find();
    res.render('read',{users});
});
app.get('/delete/:id', async (req, res) => {
    try {
        // Delete all users
        await User.findOneAndDelete({_id : req.params.id});
        // res.send('All users have been deleted');
        res.redirect('/read');
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).send('An error occurred while deleting users');
    }
});




app.post('/create',async (req,res)=>{
   let {name, email, url} = req.body;
   let user = await User.create({
        name,
        email,
        url
    })
    res.send(user);
});


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});