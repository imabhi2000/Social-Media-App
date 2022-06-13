const path = require('path');
const express = require('express');
const app = express();
require('./db/db.js');
const expresslayout = require('express-ejs-layouts');
const port = process.env.PORT || 3000;
const { googleclientid, googleclientsecret } = require('./config/keys.js');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(expresslayout);
app.set('public', path.join(__dirname, "/public"));
app.use(express.static('public'));

const passport = require('passport');
require('./passport/google-passport.js');
require('./passport/facebook-passport.js');
const { ensureAuthentication, ensureGuest } = require('./helpers/auth.js');
const session = require('express-session');
const users = require('./db/models/users.js');
const post = require('./db/models/post.js');
const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxgae: 1000 * 24 * 60 * 60 }
}));
//   app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})
app.get('/', ensureGuest, (req, res) => {
  res.render('home.ejs');
})
app.post('/savepost', (req, res) => {
  var allowcomments;
  if (req.body.allowcomments) {
    allowcomments = true;
  } else {
    allowcomments = false;
  }

  const newpost = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowcomments: allowcomments,
    user: req.user._id,

  }

  const post1 = new post(newpost);
  post1.save().then((post) => {
    res.redirect('/posts');
  });
});

//handling the posts showing page route
app.get('/posts', ensureAuthentication, (req, res) => {
  post.find({ status: 'public' }).populate('user').sort({ Date: 'desc' }).then((post) => {
    res.render('publicpost.ejs', { posts: post });
  });
});

app.get('/addpost', (req, res) => {
  res.render('addpost.ejs');

});

app.get('/about', (req, res) => {
  res.render('about.ejs');
})



//facebook login request handling
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    users.findById({ _id: req.user._id }).then((user) => {
      console.log(user.email);
      res.render('profile.ejs', { user: user });
    });

  });

//google login request handling
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    users.findById({ _id: req.user._id }).then((user) => {
      // console.log(user)
      res.redirect('/profile');
    });

  });

//showing particular user

app.get('/user/:_id', (req, res) => {
  users.findById({ _id: req.params._id }).then((user) => {
    res.render('user.ejs', { user: user });
  })
})
//adding the email
app.post('/addemail', (req, res) => {
  const email = req.body.email;
  users.findById({ _id: req.user._id }).then((user) => {
    user.email = email;
    user.save().then(() => {
      res.redirect('/profile');
    });
  });
});

app.post('/addphone', (req, res) => {
  const phone = req.body.phone;
  users.findById({ _id: req.user._id }).then((user) => {
    user.phone = phone;
    user.save().then(() => {
      res.redirect('/profile');
    });
  });
});

app.post('/addlocation', (req, res) => {
  const location = req.body.location;
  users.findById({ _id: req.user._id }).then((user) => {
    user.location = location;
    user.save().then(() => {
      res.redirect('/profile');
    });
  });
});

app.get('/users', (req, res) => {
  users.find({}).then((users) => {
    // console.log(users);
    res.render('users.ejs', { users: users });
  })
})
app.post('/editingpost/:id', (req, res) => {
  post.findById({ _id: req.params.id }).then((post) => {
    var allowcomments;
    if (req.body.allowcomments) {
      allowcomments = true;
    } else {
      allowcomments = false;
    }
    post.title = req.body.title;
    post.body = req.body.body;
    post.status = req.body.status;
    post.allowcomments = allowcomments;
    post.save().then(() => {
      res.redirect('/profile');
    }).catch((error) => {
      return console.log(error);
    });
  }).catch((error) => {
    return console.log(error);
  });
})
app.get('/editpost/:id', (req, res) => {
  post.findById({ _id: req.params.id }).then((posts) => {
    console.log(posts);
    res.render('editingpost.ejs', { posts: posts });
  });
});
app.get('/profile', ensureAuthentication, async (req, res) => {
  // console.log(req.user);
  post.find({ user: req.user._id }).populate('user').then((posts) => {
    // console.log(posts.length);
    res.render('profile.ejs', { posts: posts });

  })

  //   res.render('profile.ejs');
});
app.get('/logout', (req, res) => {
  req.logOut((error) => {
    return console.log(error);
  });
  res.redirect('/');
})
app.listen(port, (error) => {
  if (error) return console.log(error);

  console.log(`server is listening from the port ${port}`);
})

