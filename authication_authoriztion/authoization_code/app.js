const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

app.use(cookieParser());

// // Middleware for parsing JSON request bodies
// app.get('/',(req,res)=>{
//     res.cookie('name','gauarv');
//     res.send('doneeeee');
// });
// app.get('/read',(req,res)=>{
//     console.log(req.cookies);
//     res.send('doneeeee');
// });


app.get('/',(req, res)=>{
   let token =  jwt.sign({email: "gaurav@example.com"},'secret');
   res.cookie('token',token);
  res.send('cookie set ho gyi hai');
})
app.get('/read',(req, res)=>{
    console.log(req.cookies);
    let token = req.cookies.token;
    // check if token is valid or not
    jwt.verify(token,'secret',(err,decoded)=>{
        if(err){
            console.log('Token invalid');
        }else{
            console.log('Token valid');
            console.log(decoded);
        }
    })
    res.send('cookie read ho gyi hai');
//  });
})


app.listen(3000);