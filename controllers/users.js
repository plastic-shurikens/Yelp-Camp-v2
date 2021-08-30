const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registered = await User.register(user, password);
        console.log(registered);
        req.login(registered, e => {
            if(e) return next(err); 
            req.flash('success', 'Welcome To YelpCamp!');
            res.redirect('/campgrounds'); 
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.authLogin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}