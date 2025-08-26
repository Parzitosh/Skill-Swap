// This function handles the logic for showing the registration page
const showRegisterPage = (req, res) => {
    // res.render() finds the 'register.ejs' file and sends it to the browser
    res.render('register', { title: 'Register' });
};

module.exports = {
    showRegisterPage,
};