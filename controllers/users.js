const passport = require('passport');
//import check and validationResult APIs from the package
const {check, validationResult} = require('express-validator'),
Models = require('../models');
const Users = Models.User;

//authentication
const authenticate = () => {
  return passport.authenticate('jwt', {session: false});
},

//user input validation
userInputValidate = () => {
  return [
  //validation logic for request here
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(), //chain methods; opposite of empty or is not empty
  check('Email', 'Email does not appear to be valid').isEmail()
  ]
},

//add a new user (register)
addUser = (req, res) => {
  //check the validation object for errors
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username : req.body.Username}).then((user) => { //search to see if a user with the requested username already exists
    if(user){
      return res.status(400).send(req.body.Username + ' already exists.'); //if the user is found, send a response that it already exists
    }else{
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {
        res.status(201).json(user);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

//update a user's info by username
updateUser = (req, res) => {
  passport.authenticate('jwt', {session: false});
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  Users.findOne({Username : req.body.Username}).then((user) => {
    if(user){
      return res.status(400).send(req.body.Username + ' already exists.'); //if the user is found, send a response that it already exists
    }else{
      Users.findOneAndUpdate({Username: req.params.Username}, {$set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }}, {new: true}, // This line makes sure that the updated document is returned 
      (err, updatedUser) => {
        if(err){
          console.error(err);
          res.status(500).send('Error: ' + err);
        }else{
          res.json(updatedUser);
        }
      });
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

//add a movie to the user's list of favorites
addUserFavoriteMovie = (req, res) => {
  passport.authenticate('jwt', {session: false});
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {FavoriteMovies: req.params.MovieID}
  }, {new: true}, // This line makes sure that the updated document is returned 
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }else{
      res.json(updatedUser);
    }
  });
},

//remove a movie from the user's list of favorites
removeUserFavoriteMovie = (req, res) => {
  passport.authenticate('jwt', {session: false});
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {FavoriteMovies: req.params.MovieID}
  }, {new: true}, // This line makes sure that the updated document is returned 
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else{
      res.json(updatedUser);
    }
  });
},

//remove an existing user by username (deregister)
removeUser = (req, res) => {
  passport.authenticate('jwt', {session: false});
  Users.findOneAndRemove({Username: req.params.Username}).then((user) => {
    if(!user){
      res.status(400).send(req.params.Username + ' was not found.');
    }else{
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
}

module.exports = {authenticate, userInputValidate, addUser, updateUser, addUserFavoriteMovie, removeUserFavoriteMovie, removeUser};