var express = require('express');
var router = express.Router();
var posts = require('../db.json');
var request = require('request');

// var app = express();
// var reload = require('../../reload');

/* GET sign in. */
router.get('/', function (req, res, next) {
  res.render('signin', {
    title: "Signin",
    posts: posts.posts,
    users: posts.users,
    message: false
  });

});
router.post('/', function (req, res, next) {
  var users = posts.users;
  console.log(users);

  var username = req.body.username;
  var password = req.body.password;

  // console.log("Username: "+username+"======="+" Password: "+password);
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(user);
        if (username === user.username &&  password == user.password) {
      res.redirect('/index');
    } else {
      continue
    }
  
  }
});


router.get('/signup', function(req, res, next){
  res.render('signup', {
    title: 'Sign Up'
  });
});

//GET SIGNUP PAGE
router.post('/signup', function (req, res, next) {
var id = posts.users[posts.users.length-1].id + 1;


var obj = {
  "id": req.body.id,
  "username": req.body.username,
  "password": req.body.password,
  "email": req.body.email
}
request.post({

  url: "http://localhost:8000/users",
  body: obj,
  json: true

}, function (error, response, body) {
res.redirect('/');

});
});



/* GET home page. */
router.get('/index', function (req, res, next) {
  console.log(posts);

  res.render('index', {
    title: "Home",
    posts: posts.posts
  });
});

/* GET home page. */
router.get('/contact', function (req, res, next) {
  console.log(posts);

  res.render('contact', {
    title: "Contact",
    posts: posts.posts
  });
});


/* GET create page. */
router.get('/new', function (req, res, next) {
  // console.log(posts);

  res.render('new', {
    title: "new"
  });
  console.log(req.body);

});


/* POST to create page. */
router.post('/new', function (req, res, next) {

  let obj = {
    "title": req.body.title,
    "author": req.body.author,
    "timeDate": req.body.timeDate,
    "content": req.body.content,
  }


  request.post({

    url: "http://localhost:8000/posts",
    body: obj,
    json: true

  }, function (error, response, body) {

    res.render('index', {
      title: "Home",
      posts: posts.posts
    });

  });

});

//VIEW POST
router.get('/:id', function (req, res, next) {
  //make a post request to our database
  request({
    uri: "http://localhost:8000/posts/" + req.params.id,
    method: "GET",
  }, function (error, response, body) {
    console.log(JSON.parse(body));
    //send a response message
    res.render('view', { posts: JSON.parse(body) });
  });
})


//DELETE BUTTON
router.get('/delete/:id', function (req, res, next) {
  console.log(req.params.id)

  request({
    uri: "http://localhost:8000/posts/" + req.params.id,
    method: "DELETE",
  }, function (error, response, body) {

    let data = {
      message: 'Successfully Removed.',
    }

    res.redirect('/index');
  });
});


// UPDATE ROUTES
router.get('/update/:id', function (req, res, next) {

  //make a post request to our database
  request({
    uri: "http://localhost:8000/posts/" + req.params.id,
    method: "GET",
  }, function (error, response, body) {
    console.log(JSON.parse(body));
    //send a response message
    res.render('update', { message: false, posts: JSON.parse(body) });
  });

});

router.post('/update/:id', function (req, res, next) {
  request({
    uri: "http://localhost:8000/posts/" + req.params.id,
    method: "PATCH",
    form: {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    }
  }, function (error, response, body) {
    // console.log(body);
    //send a response message
    res.render('update', { message: 'Successfully Changed.', posts: JSON.parse(body) });
  });
});


module.exports = router;