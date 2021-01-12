var express = require('express');
var router = express.Router();
const models = require('../models');
var authService = require('../services/auth');
const { Op } = require('sequelize');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('error', {
    message: "Sorry, this page is unavailable!"
  });
});

//GET signup page
router.get('/signup', function(req, res, next){
  res.render('signup');
});

//POST signup form
router.post('/signup', function(req, res, next){
  models.users
  .findOrCreate({
    where: {
      [Op.or]: [ { Email: req.body.email }, { Username: req.body.username }]
    },
    defaults: {
      FirstName: req.body.firstname,
      LastName: req.body.lastname,
      Email: req.body.email,
      Username: req.body.username,
      //Password: req.body.password
      Password: authService.hashPassword(req.body.password)
    }
  }).spread(function(result, created){
    if(created){
//TODO: change this to go right to user profile after testing..
      res.render('login', {
        message: "User Successfully created! please login!"
      });
    }else{
      res.render('error', {
        message: "Sorry, this user already exists!"
      });
    }
  });
});

//GET login page
router.get('/login', function(req, res, next){
  res.render('login', {
    message: "Welcome, please login!"
  });
});

//POST login form
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username
    }
  }).then(user => {
    if (!user) {
      res.render('error', {
        message: "Sorry, login failed!"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        res.redirect('/users/profile');
      } else {
        res.render('error', {
          message: "Sorry, login failed!"
        });
      }
    }
  });
});

//GET profile - secure route:
router.get('/profile', function (req, res, next) {
  //get the token from the request
  let token = req.cookies.jwt;
  //if there is one
  if (token) {
    //verify
    authService.verifyUser(token)
      .then(user => {
        //if verified
        if (user) {
          //get all posts where postsUserId: user.UserId
          models.posts.findAll({where: { 
            UserId: user.UserId,
            Deleted: false
           }})
          .then(posts => {
            //and if admin
          if(user.Admin){
            models.users.findAll({
              where: {
                Deleted: false
              }
            })
            .then(users =>{
              res.render('admin', {
                firstname: user.FirstName,
                lastname: user.LastName,
                email: user.Email,
                username: user.Username,
                users: users,
                posts: posts
              });
            })
          //else if regular user
          }else{
            res.render('profile', {
              firstname: user.FirstName,
              lastname: user.LastName,
              email: user.Email,
              username: user.Username,
              posts: posts
            });
          }
          })
          //if unable to verify
        } else {
          res.render('error', {
            message: "Sorry, I don't recognize you!"
          });
        }
      });
  } else {
    res.render('login', {
      message: "Sorry, you must be logged in to see this page!"
    });
  }
});

//POST logout button - logout is actually get?
router.get('/logout', function (req, res, next) {
  res.cookie('jwt', "", { expires: new Date(0) });
  res.render('login', {
    message: "Log Back In?"
  });
  });

//POST: delete user
router.post('/:id', function(req, res, next){
    
  let userId = parseInt(req.params.id);

    models.users
    .update({ Deleted: true }, { where: {
        UserId: userId
    }})
    .then(
      //res.send('user successfully deleted');
      res.redirect('/users/profile')
    )
    .catch(err => {
      res.render('error', {
        message: "Sorry, couldn't delete user!"
      });
      //res.status(400);
      //res.send('Houston, we have a problem!');
    });
})

// GET admin view user - despite the route name, this does NOT edit the user.
// again, this link is only available to an admin
router.get('/admin/editUser/:id', function(req, res, next){
  let userId = parseInt(req.params.id);
  //ifAdmin
  //res.send(`this button will allow the admin to see user ${userId}`);
  models.users.findOne( {where: {
    UserId: userId
  }})
  .then(user => {
    res.render('viewuser', {
      firstname: user.FirstName,
      lastname: user.LastName,
      email: user.Email,
      username: user.Username
    })
  })
});

module.exports = router;
