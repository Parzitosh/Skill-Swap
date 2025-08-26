const express = require('express');
const path = require('path'); // Import the 'path' module

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find the views directory
app.set('views', path.join(__dirname, 'views'));

// --- Routes will be added here later ---

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});