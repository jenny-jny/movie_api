const express = require('express'),
router = express.Router(),
passport = require('passport');
const moviesController = require('../controllers/movies');

router.get('/movies', passport.authenticate('jwt', {session: false}), moviesController.getMovies);
router.get('/movies/:Title', passport.authenticate('jwt', {session: false}), moviesController.getMovieTitle);
router.get('/movies/:Title/genre', passport.authenticate('jwt', {session: false}), moviesController.getMovieGenre);
router.get('/movies/:Title/director', passport.authenticate('jwt', {session: false}), moviesController.getMovieDirector);

module.exports = router;