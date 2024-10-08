const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/read', async (req, res) => {
    try {
        let users = await User.find();
        res.render('read', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users');
    }
});
// Route to display the edit form
app.get('/edit/:userid', async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('edit', { user });
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).send('An error occurred while finding the user');
    }
});

// Route to handle updating the user
app.post('/update/:userid', async (req, res) => {
    try {
        const { name, email, url } = req.body;
        await User.findByIdAndUpdate(req.params.userid, { name, email, url }, { new: true });
        res.redirect('/read');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user');
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id });
        res.redirect('/read');
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).send('An error occurred while deleting users');
    }
});

app.post('/create', async (req, res) => {
    let { name, email, url } = req.body;
    try {
        let user = await User.create({
            name,
            email,
            url
        });
        res.send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('An error occurred while creating the user');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
