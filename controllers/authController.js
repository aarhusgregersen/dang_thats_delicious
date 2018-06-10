const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  succesRedirect: '/',
  succesFlash: 'You are now logged in 😃'
});
