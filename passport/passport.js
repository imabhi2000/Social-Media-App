const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = require('../db/models/users.js');
const keys = require('../config/keys.js');


passport.use(new GoogleStrategy({
    clientID: keys.googleclientid,
    clientSecret: keys.googleclientsecret,
    callbackURL: "/auth/google/callback",
    proxy:true
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
    users.findOne({
        google:profile.id,

    }).then((user1)=>{
            if(user1){
                done(null , user1);
                console.log(profile.emails[0].value);
            }else{
                //this means there is no user in the database
                const newuser = new users({
                    google:profile.id,
                    fullname:profile.displayName,
                    lastname:profile.name.familyName,
                    firstname:profile.name.givenName,
                    image:profile.photos[0].value,
                    email:profile.emails[0].value

                });
                // console.log(profile.emails);
                console.log(profile.emails[0].value);

                newuser.save().then((user)=>{
                    done(null , user);
                }).catch((error)=>{
                    console.log(error);
                });
            }
    }).catch((error)=>{
      console.log(error);
    });

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