const showRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

// New function to handle form submission
const registerUser = (req, res) => {
    // req.body contains the data from the form
    const { name, email, password } = req.body;

    // For now, we'll just log the data to the console to see it
    console.log('User registration data:', { name, email, password });

    // Send a success message back to the user
    res.send('Registration successful! Check the console to see your data.');
};

module.exports = {
    showRegisterPage,
    registerUser, // Export the new function
};