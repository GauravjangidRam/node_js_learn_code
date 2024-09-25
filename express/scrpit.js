const express = require('express')
const app = express()


app.get('/', function (req, res) {
  res.send('Hello World')
})

const http = require('http');
const emoji = require('node-emoji');

// Define the port to listen on
const port = 3000;

const server = http.createServer((req, res) => {
    // Use the emoji package to print an emoji
    const message = `Hello World ${emoji.get('earth_americas')} ${emoji.get('smile')}`;

    // Send response with the emoji message
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(message);

    // Also log the message to the console
    console.log(message);
});

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// app.listen(3000)