const fs = require('fs');
const express = require('express');
const cookie = require('cookie');
const path = require('path');
const UserModel = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserNotes = require('./model/userNotes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
    try {
        res.render('home');
    } catch (e) {
        console.log(e);
    }
});

// Register form route
app.get("/register", (req, res) => {
    res.render('register');
});

// Display notes route (load from saved files)
app.get("/notes", (req, res) => {
    const notesDir = path.join(__dirname, 'data');
    const notes = [];

    // Read all files from the directory
    fs.readdir(notesDir, (err, files) => {
        if (err) {
            console.log("Error reading directory", err);
            return res.status(500).send("Error loading notes");
        }

        files.forEach(file => {
            const content = fs.readFileSync(path.join(notesDir, file), 'utf8');
            notes.push({
                title: file.replace('.txt', ''), // Remove the .txt extension
                description: content
            });
        });

        // Pass the notes array when rendering the page
        res.render('notes', { notes });
    });
});

// Register post route
app.post('/register', async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Hash the password
        let hashedPassword = await bcrypt.hash(password, 10);

        // Create the user and save to DB
        const user = new UserModel({
            name,
            email,
            username,
            password: hashedPassword
        });

        // Generate a JWT token
        let token = jwt.sign({ email }, "mySecretKey");
        res.cookie('access', token);

        await user.save();

        // Redirect to notes page after registration
        res.redirect('/notes');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error registering user");
    }
});

// Save a note to file
const notesDir = path.join(__dirname, 'data'); // Directory for storing notes
app.post('/notes', (req, res) => {
    const { title, description } = req.body;

    // Ensure the directory exists
    if (!fs.existsSync(notesDir)) {
        fs.mkdirSync(notesDir);
    }

    // Save the note to a file
    const filePath = path.join(notesDir, `${title}.txt`);

    fs.writeFile(filePath, description, (err) => {
        if (err) {
            console.log("Error saving file:", err);
            return res.status(500).send("Error saving note");
        }
        console.log("File saved successfully");

        // Redirect back to the notes page after saving
        res.redirect('/notes');
    });
});

// Start the server
app.listen(3000, (err) => {
    if (err) {
        console.log("Error starting server:", err);
    } else {
        console.log("Server running on port 3000");
    }
});
