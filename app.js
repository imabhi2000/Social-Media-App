const path = require('path');
const express = require('express');
const app = express();
require('./db/db.js');
const expresslayout = require('express-ejs-layouts');
const port = process.env.PORT || 3000;
const {googleclientid , googleclientsecret} = require('./config/keys.js');
app.set('views' , path.join(__dirname , '/views'));
app.set('view engine' , 'ejs');
app.use(expresslayout);
app.set('public' , path.join(__dirname , "/public"));
app.use(express.static('public'));
const passport = require('passport');
require('./passport/passport.js');
require('./passport/facebook-passport.js');
const session = require('express-session');
const users = require('./db/models/users.js');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxgae: 1000*24*60*60 }
  }));
//   app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})
app.get('/' , (req,res)=>{
    res.render('home.ejs');
})

app.get('/about' , (req,res)=>{
    res.render('about.ejs');
})

//facebook login request handling
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    users.findById({_id:req.user._id}).then((user)=>{
      res.render('profile.ejs' , {user:user});
  });
    
  });

  //google login request handling
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile' , 'email'] }));
 
app.get('auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    users.findById({_id:req.user._id}).then((user)=>{
      res.render('profile.ejs' , {user:user});
  });
    
  });

  app.get('/profile' , async (req,res)=>{
      console.log(req.user);
      users.findById({_id:req.user._id}).then((user)=>{
          res.render('profile.ejs' , {user:user});
      });

    //   res.render('profile.ejs');
  });
  app.get('/logout' , (req,res)=>{
      req.logOut((error)=>{
          return console.log(error);
      });
      res.redirect('/');
  })
app.listen(port , (error)=>{
    if(error) return console.log(error);

    console.log(`server is listening from the port ${port}`);
})