const express = require('express'),
router = express.Router(),
moviesController = require('../controllers/movies');

//authenticate() because needs to be immediately called, unlike getMovies, which is an asynch function
router.get('/', moviesController.getMovies);
router.get('/:Title', moviesController.authenticate(), moviesController.getMovieTitle);
router.get('/:Title/genre', moviesController.authenticate(), moviesController.getMovieGenre);
router.get('/:Title/director', moviesController.authenticate(), moviesController.getMovieDirector);

module.exports = router;