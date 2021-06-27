const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport'),
cors = require('cors'),
Models = require('./models');

require('./passport');

let = allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) //allows requests with no origin, like mobile apps
    return callback(null, true); //error = null, allow access = true
    if(allowedOrigins.indexOf(origin) === -1){ //if a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from the origin ' + origin;
      return callback(new Error(message), false); //allow access = false
    }
    return callback(null, true); //error = null, allow access = true
  }
}));
let auth = require('./auth')(app);

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

//logging with morgan
app.use(morgan('common'));

//serving static files
app.use(express.static('public'));

//default text response when at '/'
app.get('/', passport.authenticate('jwt', {session: false}), (req, res) => { //does not save user in the session, as bearer token sent along request everytime 
  res.send('Welcome to myFlix!');
});

//GET a list of ALL movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get the data of a single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get data (descrition) about a genre by movie title 
app.get('/movies/:Title/genre', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

//get data about a director by movie title 
app.get('/movies/:Title/director', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
});

//add a new user (register)
app.post('/users', (req, res) => {
  Users.findOne({Username : req.body.Username}).then((user) => {
    if(user){
      return res.status(400).send(req.body.Username + ' already exists.');
    }else{
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
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
});

//update a user's info by username
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

//add a movie to the user's list of favorites
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

//remove a movie from the user's list of favorites
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

//remove an existing user by username (deregister)
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

//error handling
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});