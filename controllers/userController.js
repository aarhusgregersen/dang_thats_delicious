const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'});
}

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'});
}

exports.validateRegister = (req, res, next) => { // Validation middleware
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password can not be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirmed password can not be blank!').notEmpty();
  req.checkBody('password-confirm', 'Oops!, Your passwords do not match.').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // Stop function from running
  }
  next(); // No errors!
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, username: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password); // This is already hashed because user model has local-passport plugin activated
  next(); // Pass off to auth controller
}
