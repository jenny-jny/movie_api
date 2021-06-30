const passport = require('passport');
Models = require('../models');
const Movies = Models.Movie;

//authentication
const authenticate = () => {
  return passport.authenticate('jwt', {session: false});
},

//GET a list of ALL movies
getMovies = (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

//get the data of a single movie by title
getMovieTitle = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

//get data (descrition) about a genre by movie title 
getMovieGenre = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
},

//get data about a director by movie title 
getMovieDirector = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
}

module.exports = {authenticate, getMovies, getMovieTitle, getMovieGenre, getMovieDirector};