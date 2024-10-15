const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Required to work with cookies
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); // Added middleware to parse cookies
app.set('view engine', 'ejs');

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/user-database', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    // Start the server only after successful DB connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectDB();

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// User model 
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      username,
      password: hashedPassword
    });

    // Use a secret key when signing the JWT
    let token = jwt.sign({ email }, "yourSecretKey"); // Replace "yourSecretKey" with your actual secret key
    res.cookie("token", token);
    await user.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).send('Invalid email');
  } else {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) throw err;
      if (result) {
        // Use a secret key when signing the JWT
        let token = jwt.sign({ email: user.email }, "yourSecretKey"); // Replace "yourSecretKey" with your actual secret key
        res.cookie("token", token);
        res.redirect('/');
      } else {
        return res.status(401).send('Incorrect password');
      }
    });
  }
});

app.get('/logout', (req, res) => {
  // Clear the cookie by setting its expiration to a past date
  res.cookie('token', '');
  res.redirect('/');
});
