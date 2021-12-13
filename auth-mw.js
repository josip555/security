const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');

function initCookieAuth(app) {
  app.use(cookieParser(process.env.COOKIE_KEY || 'some random key'));
}

function signInUser(res, username) {
  res.cookie('user', username, {
      signed : true,
      httpOnly: true
  });
  res.cookie('username', username);
  res.cookie('authenticated', true);
}

function signOutUser(res, username) {
  res.clearCookie('user');
  res.clearCookie('username');
  res.clearCookie('authenticated');
}


function getUserFromCookie(req, res, next) {  
  const username = req.signedCookies?.user;  
  if (username) { 
    req.user = {
      isAuthenticated : true,
      username
    };
  }
  else {
    req.user = {
      isAuthenticated : false      
    };
  }
  next(); 
}
  
module.exports = {getUserFromCookie, initCookieAuth, signInUser, signOutUser};