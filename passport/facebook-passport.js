const passport = require('passport');
const users = require('../db/models/users.js');
const keys = require("../config/keys.js");
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: keys.facebookclientid,
    clientSecret: keys.facebookclientsecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'],
    proxy:true,
    enableProof:true
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    // console.log(`http://graph.facebook/${profile.id}/picture?type=large`);
    users.findOne({facebook:profile.id}).then((user)=>{
      if(user){
        // console.log(user.email);
       done(null , user);
      }else{
        const user1 = new users({
            facebook:profile.id,
            // email:profile.emails[0].value,
            image:profile.photos[0].value,
            fullname:profile.displayName

        });

        user1.save().then((user)=>{
            done(null , user);
        }).catch((error)=>{
            console.log(error);
        })
      }
    }).catch((error)=>{
        console.log(error);
    })
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