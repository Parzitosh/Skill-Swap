const express = require('express');
const path = require('path');

// Import the user routes
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Tell the app to use the userRoutes for any URL starting with '/users'
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});