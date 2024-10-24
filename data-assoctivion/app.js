const express = require('express');
const app = express();
const userModel = require('./model/user');
const postModel = require('./model/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Render registration form
app.get('/', (req, res) => {
    res.render('index');   
});

app.get('/login', (req, res) => {
    res.render('login');   
});

app.get('/profile', islogin, (req, res) => {
   console.log(req.user); // This will now log the correct user details
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password, name, age } = req.body;

    try {
        // Check if user already exists
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists!');
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user and save to the database
        const newUser = new userModel({
            username,
            name,
            age,
            email,
            password: hashedPassword // Save hashed password
        });

        // Save the new user to the database
        await newUser.save(); 

        // Create a JWT with the user's email and _id
        let token = jwt.sign({ email, username: newUser.username, userId: newUser._id }, 'secretKey');
        res.cookie('token', token);

        // Respond with a success message
        return res.status(201).send('User registered successfully!');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).send('User not found!');
        }

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, existingUser.password, (err, result) => {
            if (result) {
                // Create a JWT with the user's email and _id
                let token = jwt.sign({ email, username: existingUser.username, userId: existingUser._id }, 'secretKey');
                res.cookie('token', token);
                res.send("Login successful");
            } else {
                res.status(400).send('Invalid password');
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');   
});

// islogin middleware
function islogin(req, res, next) {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = user; // Attach the decoded token data (user info) to req.user
        next();
    });
}

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
