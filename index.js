const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.set('view engine', 'ejs');

//it can redirect home page 
app.get('/', (req, res) => {
    res.render('index');
})

// app.get('/',function(req, res){
//     res.send('working now');
// });

app.listen(3000, function(){
    console.log('working ');
})