var express = require('express');
var router = express.Router();
const models = require('../models');
var authService = require('../services/auth');
const { post } = require('./users');

/* GET posts page. */
//secure route
router.get('/', function (req, res, next) {
  let token = req.cookies.jwt;
  if(token){
    authService.verifyUser(token)
    .then(user => {
      //if verified
      if (user) {
        //include is sequelize for joining tables users and posts - object now has all columns
        models.posts.findAll({ 
          where: { Deleted: false },
          include: models.users
        })
        
        .then(posts => {
          console.log(JSON.stringify(posts))
            //provide a posts object to the page for iteration
            res.render('posts', {
              posts: posts,
              user: user
            });
        });
      } else {
        res.render('error', {
          message: "Sorry, you're not authorized to see that page!"
        });
      }
    })
    .catch(err => {
      res.render('error', {
        message: "Sorry, something went wrong!"
      });
    });
  }else{
    res.render('error', {
      message: "Sorry, you're not logged in!"
    });
  }
  });

  // router.get('/', function (req, res, next) {
  //   let token = req.cookies.jwt;
  //   if(token){
  //     authService.verifyUser(token)
  //     .then(user => {
  //       //if verified
  //       if (user) {
  //         models.posts.findAll({ where: { Deleted: false } })
  //         .then(posts => {
  //             //provide a posts object to the page for iteration
  //             res.render('posts', {
  //               posts: posts,
  //               user: user
  //             });
  //         });
  //       } else {
  //         res.render('error', {
  //           message: "Sorry, you're not authorized to see that page!"
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       res.render('error', {
  //         message: "Sorry, something went wrong!"
  //       });
  //     });
  //   }else{
  //     rres.render('error', {
  //       message: "Sorry, you're not logged in!"
  //     });
  //   }
  //   });


//Create new post
router.post('/', function(req, res, next){
    //get the token from the request
  let token = req.cookies.jwt;
  //if there is one
  if (token) {
    authService.verifyUser(token)
    .then(user => {
      models.posts.create({
        PostTitle: req.body.title,
        PostBody: req.body.body,
        UserId: user.UserId
      })
    })
    .then(result => {
      res.redirect('/posts');
    })
  }
});

//Edit post button
router.get('/editpost/:id', function(req, res, next){
  let postId = parseInt(req.params.id);
  //get post where id matches
  models.posts.findOne({where: {
    PostId: postId
  }})
  .then(post => {
    res.render('editpost', {
      post: post
    })
  })
})

//Edit post - this handles the body of update page itself
router.post('/updatepost/:id', function(req, res, next){
  let postId = parseInt(req.params.id);
  models.posts.update({ 
    PostTitle: req.body.title,
    PostBody: req.body.body
  }, { where: {
    PostId: postId
  }})
  .then(
    res.redirect(`/users/profile`)
  )
  .catch(err => {
    res.render('error', {
      message: "Houston, we have a problem!"
    });
  });
});


//GET 'DELETE' post:
//since this button is only viewable as admin, we can just add functionality
router.get('/deletepost/:id', function(req, res, next){
  //res.send(`this button is going to delete post id${req.params.id}`);
  let postId = parseInt(req.params.id);
  models.posts.update({ Deleted: true }, { where: {
    PostId: postId
  }})
  .then(
    res.redirect(`/posts`)
  )
  .catch(err => {
    res.render('error', {
      message: "Houston, we have a problem!"
    });
  });
});

module.exports = router;