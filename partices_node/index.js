const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
app.get('/',(req, res)=>{
    fs.readdir(path.join(__dirname,'files'),(err,files)=>{
        res.render('index',{files:files});
    });
});

//  File Name show into small case 

// app.post('/create',(req, res)=>{
//   console.log(req.body);
//   fs.writeFile(`./files/${req.body.title.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')}.txt`, req.body.details, function (err) {
//     if (err) {
//       return res.status(500).send('Error saving the file');
//     }
//     res.redirect('/');
//   });
// });
// app.listen(3000);

//  File Name show into upper case 

app.post('/create', (req, res) => {
  const fileName = req.body.title
    .toLowerCase()
    .split(' ')
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  fs.writeFile(`./files/${fileName}.txt`, req.body.details, function (err) {
    if (err) {
      return res.status(500).send('Error saving the file');
    }
    res.redirect('/');
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
