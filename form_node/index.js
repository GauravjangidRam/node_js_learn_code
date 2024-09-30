const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// jo bhi static file hai wo public folder main milege 
app.use(express.static(path.join(__dirname, 'public')));
// Correctly set the view engine`
app.set('view engine', 'ejs');


// app.get('/', function (req, res) {
//     res.render('index');
// });

app.get('/life/:username', function (req, res) {
    res.send(`Welcome, ${req.params.username}`);
});
app.get('/life/:username/:lastname', function (req, res) {
    res.send(`Welcome, ${req.params.username} ${req.params.lastname}`);
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
