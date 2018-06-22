const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in 😃'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out 👋");
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  // First check if user is authenticated
  if(req.isAuthenticated()) {
    next(); // User is logged in - carry on!
    return;
  }
  req.flash('error', 'Oops! You must be logged in to do that!');
  req.redirect('/login');
}

exports.forgot = async (req, res) => {
  // 1. See if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No account was found with that email'); // Security flaw here that shouldnt' be used for an actual application.
    return res.redirect('/login');
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash ('success', `You have been emailed a reset password link. ${resetURL}`);
  // 4. Redirect to login page
  res.redirect('/login');
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() } // MongoDB function
  });
  if (!user) {
    req.flash('error', 'Password reset token is expired or invalid');
    return res.redirect('/login');
  }
  res.render('reset', { title: 'Reset your Password' });
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset token is expired or invalid');
    return res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser); 
  req.flash('success', 'Nice! Your password has been reset');
  res.redirect('/');
}
