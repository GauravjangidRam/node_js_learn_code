const fs = require('fs');
const express = require('express');
const cookie = require('cookie');
const path = require('path');
const UserModel = require('./user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const UserNotes = require('./model/userNotes');

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

    // Ensure the directory exists
    if (!fs.existsSync(notesDir)) {
        return res.status(500).send("Notes directory does not exist.");
    }

    // Read all files asynchronously from the directory
    fs.readdir(notesDir, (err, files) => {
        if (err) {
            console.log("Error reading directory", err);
            return res.status(500).send("Error loading notes");
        }

        let fileReads = files.map(file => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(notesDir, file), 'utf8', (err, content) => {
                    if (err) reject(err);
                    resolve({
                        title: file.replace('.txt', ''), // Remove the .txt extension
                        description: content
                    });
                });
            });
        });

        // Resolve all file reads and render the notes
        Promise.all(fileReads)
            .then(notesArray => {
                res.render('notes', { notes: notesArray });
            })
            .catch(err => {
                console.log("Error reading files", err);
                res.status(500).send("Error reading notes");
            });
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

    // Check if the title or description is empty or just whitespace
    if (!title.trim() || !description.trim()) {
        return res.status(400).send("Title and description cannot be empty or just spaces.");
    }

    // Ensure the directory exists
    if (!fs.existsSync(notesDir)) {
        fs.mkdirSync(notesDir);
    }

    // Save the note to a file
    const filePath = path.join(notesDir, `${title.trim()}.txt`);

    fs.writeFile(filePath, description.trim(), (err) => {
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
const PORT = process.env.PORT || 3001; // Change 3000 to 3001 or another port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

