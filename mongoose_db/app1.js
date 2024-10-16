const express = require('express');
const mongoose = require('mongoose');
const userModel = require('./usermodel'); // The corrected user model
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mongooseDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('heyyyy');
});

// Create user route
app.get('/create', async (req, res) => {
    try {
        // Check if the user already exists (await is needed here)
        let userExist = await userModel.findOne({ name: 'gaurav' });

        if (userExist) {
            return res.status(400).send("User already exists");
        }

        // If user doesn't exist, create a new one
        let createUser = await userModel.create({
            name: '.kul',
            email: 'mridul@example.com',
            password: 'mridul@0041'
        });
        res.send(createUser); // Send the created user object as the response
    } catch (err) {
        res.status(500).send('Error creating user: ' + err.message);
    }
});

// update user using a usermodel with help of findOneAndUpdate method to update use data 

// es m three parmeter pass hota hai es method m jis m phle jo (findone ,update {new:true})
//   ->findOne == >jis ko update karna hai us ko find karne ke liye {password : "gaurav"}
    // ->update ==>  update ke baat kya show karn hai use ko likhe hai {password : "Gaurav@004"}
app.get('/update',async(req,res)=>{
    // userModel.findOneUpdate(findone , update, {new: true});
    let updatedUser = await userModel.findOneAndUpdate({password : "gaurav"} , {password : "Gaurav@2004"}, {new: true});
    res.send(updatedUser)
})

// read a model using this method
// there are to type of reading 
    // 1. find() => to get all documents
    // 2. findOne() => to get a single document
app.get('/read',async(req,res)=>{
    let users = await userModel.find();
    // let users = await userModel.findOne({name : "mridul"});
    res.send(users)
})

// delect method we can delect partical name using findOneAndDelect
app.get('/delect',async(req,res)=>{
    let users = await userModel.findOneAndDelete({name : "John Doe"});
    res.send(users)
})

 
// Start the server
app.listen(3000, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log('Server is running on port 3000');
    }
});
