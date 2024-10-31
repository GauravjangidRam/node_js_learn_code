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

app.get('/login', async(req, res) => {
    res.render('login');
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
        return res.render('login');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong.');
    }
});

app.get('/register', (req, res) => {
    res.render('index');
})
// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).send('User not found!');
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(400).send('Invalid password');
        }

        // Create a JWT with the user's email and _id
        let token = jwt.sign({ 
            email: existingUser.email, 
            username: existingUser.username, 
            userId: existingUser._id,
            name: existingUser.name,
            age: existingUser.age 
        }, 'secretKey');

        res.cookie('token', token);
        
        // Retrieve posts for the logged-in user
        const posts = await postModel.find({ user: existingUser._id });

        // Pass the user object and posts to the profile template
        return res.render('profile', { 
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
        return res.status(500).send('Something went wrong.');
    }
});

app.get('/profile', islogin, async (req, res) => {
    try {
        // Find the user and populate the 'posts' field with post details
        const user = await userModel.findById(req.user.userId).populate('posts');
        res.render('profile', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong while fetching profile data.');
    }
});
app.get('/like/:id', islogin, async (req, res) => {
    try {
        // Find the user and populate the 'posts' field with post details
        const post = await postModel.findById({_id: req.params.id}).populate('user');
    if(post.likes.indexOf(req.user.userId) === -1) {
        post.likes.push(req.user.userId);
        await post.save();
        res.redirect('/profile');
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userId), 1);
        await post.save();
        res.redirect('/profile');
    }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong while fetching profile data.');
    }
});
//edit new post 
app.get('/edit/:id', islogin, async (req, res) => {
        const post = await postModel.findById({_id: req.params.id}).populate('user');
            res.render('edit', { post});
});
app.post('/update/:id', islogin, async (req, res) => {
    try {
        // Update the post content in the database
        await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content });
        
        // Redirect to the profile page after updating
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating the post content');
    }
});



app.get('/delete/:id', islogin, async (req, res) => {
    const post = await postModel.findById({_id: req.params.id}).populate('user');
    console.log(post);
    if(post.user._id.toString() === req.user.userId){
        await postModel.findByIdAndDelete(req.params.id);
        res.redirect('/profile');
    }
    
        // res.render('profile', { post});
});
// Create a post
app.post('/post', islogin, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        const { content } = req.body;

        if (!user) {
            return res.status(400).send("User not found!");
        }

        // Create a new post associated with the user
        const post = new postModel({
            user: user._id,
            content: content,
        });
        await post.save();

        // Add the post to the user's post array
        user.posts.push(post._id);
        await user.save();

        // Redirect to profile to display updated posts
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong while creating the post.');
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
        return res.redirect('/login');   
        
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
