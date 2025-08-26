// Import the express library
const express = require('express');

// Create an instance of an express application
const app = express();

// Define the port the server will run on
const PORT = 3000;

// Create a basic route for the homepage
// When a user visits '/', it will send back a welcome message
app.get('/', (req, res) => {
    res.send('Welcome to the SkillSwap server!');
});

// Start the server and listen for incoming connections on the specified port
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});