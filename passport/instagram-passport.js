const passport = require('passport');
const InstagramStrategy = require('passport-instagram').Strategy;
const users = require('../db/models/users.js');
const keys = require('../config/keys.js');

passport.use(new InstagramStrategy({
    clientID: keys.instagramclientid,
    clientSecret: keys.instagramsecret,
    callbackURL: "/auth/instagram/callback",
    proxy:true
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null,user);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    users.findById(id, function (err, user) {
      done(err, user);
    });
  });
