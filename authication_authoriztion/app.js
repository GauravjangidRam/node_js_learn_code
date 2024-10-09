const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.use(cookieParser());
// Middleware for parsing JSON request bodies
app.get('/',(req,res)=>{
    res.cookie('name','gauarv');
    res.send('doneeeee');
});
app.get('/read',(req,res)=>{
    console.log(req.cookies);
    res.send('doneeeee');
});

app.listen(3000);