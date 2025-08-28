const protect = (req, res, next) => {
    if (req.session.userId) {
        // If the user is logged in (i.e., a session exists),
        // continue to the next function in the chain.
        next();
    } else {
        // If no session exists, redirect them to the login page.
        res.redirect('/users/login');
    }
};

const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};


module.exports = { 
    protect,
    noCache 
};