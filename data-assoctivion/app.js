const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const userModel = require('./model/user');
const post = require('./model/post');

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    try{
        res.render('index');

    }catch(err){
        console.error(err);
        res.status(500).send('Something broke!');
    }
});

// app.post('/create', async (req, res) => {
//     let { name, email, password, message } = req.body;
//     try {
//         let hash = bcrypt.hashSync(password, 10);
//         console.log(hash);
//         let user = await userModel.create({
//             name,
//             email,
//             password: hash,
//             posts: [] // Initialize posts as an empty array
//         });
//         res.send(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Something broke!');
//     }
// });

app.listen(3000,(err,res)=>{
    if(err){
        console.log(err);
    }
    console.log('Server running on port 4000');
});