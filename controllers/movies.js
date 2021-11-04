/**
 * @requires passport
 * @requires models
*/
const passport = require('passport');
Models = require('../models');

 /**
  * @constant
  * @type {Movie}
 */
const Movies = Models.Movie;

const authenticate = () => {
  return passport.authenticate('jwt', {session: false});
},

/**
 * GET the data of all movies
 * @param {Object} req
 * @param {Object} res
 */
getMovies = (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

/** 
 * GET the data of a single movie by movie title
 * @param {Object} req
 * @param {Object} res
 */
getMovieTitle = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
},

/**
 * GET the data of a genre by movie title 
 * @param {Object} req
 * @param {Object} res
 */
getMovieGenre = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
},

/**
 * GET the data of a director by movie title 
 * @param {Object} req
 * @param {Object} res
 */
getMovieDirector = (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
}

module.exports = {authenticate, getMovies, getMovieTitle, getMovieGenre, getMovieDirector};