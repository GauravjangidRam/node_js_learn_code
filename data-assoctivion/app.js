const express = require('express');
const app = express();
const userModel = require('./model/user');
const postModel = require('./model/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');// Make sure to require 'path'
const upload = require('./config/multerconfig');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());


// Render registration form
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password, name, age } = req.body;

  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      name,
      age,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ email, username: newUser.username, userId: newUser._id }, 'secretKey');
    res.cookie('token', token);

    res.render('login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
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

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({
      email: existingUser.email,
      username: existingUser.username,
      userId: existingUser._id,
      name: existingUser.name,
      age: existingUser.age
    }, 'secretKey');

    res.cookie('token', token);

    const posts = await postModel.find({ user: existingUser._id });
    res.render('profile', {
      user: {
        name: existingUser.name,
        username: existingUser.username,
        email: existingUser.email,
        age: existingUser.age
      },
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});

// Profile route
app.get('/profile', islogin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).populate('posts');
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while fetching profile data.');
  }
});

// Like/Unlike Post
app.get('/like/:id', islogin, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.likes.includes(req.user.userId)) {
      post.likes = post.likes.filter(id => id !== req.user.userId);
    } else {
      post.likes.push(req.user.userId);
    }
    await post.save();
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while liking/unliking the post.');
  }
});

// Edit Post
app.get('/edit/:id', islogin, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.render('edit', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching post for editing');
  }
});

app.post('/update/:id', islogin, async (req, res) => {
  try {
    await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content });
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating the post content');
  }
});

// Delete Post
app.get('/delete/:id', islogin, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.user.toString() === req.user.userId) {
      await postModel.findByIdAndDelete(req.params.id);
      res.redirect('/profile');
    } else {
      res.status(403).send('Not authorized to delete this post');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting the post');
  }
});

// Create a post
app.post('/post', islogin, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    const { content } = req.body;

    const post = new postModel({ user: user._id, content });
    await post.save();

    user.posts.push(post._id);
    await user.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while creating the post.');
  }
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Upload Image
// es ko dusar file mein bana lege 
app.get('/profile/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', islogin, upload.single('image'), async (req, res) => {
  try {
    let user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.profile = req.file.filename; // Save filename as a string
    await user.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong while uploading the profile picture');
  }
});

// app.get('/upload', (req, res) => {
//     res.render('skyshort');
// })
// islogin middleware
function islogin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
}

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
