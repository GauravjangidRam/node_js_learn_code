const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    try{
        res.send('Hello World');
    }catch(err){
        console.error(err);
        res.status(500).send('Something broke!');
    }
})
app.listen(4000,(err,res)=>{
    if(err){
        console.log(err);
    }
    console.log('Server running on port 4000');
})