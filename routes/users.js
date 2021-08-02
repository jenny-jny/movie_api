const express = require('express'),
router = express.Router(),
usersController = require('../controllers/users');

//userInputValidate() and authenticate() because needs to be immediately called, unlike getMovies, which is an asynch function
router.post('/register', usersController.userInputValidate(), usersController.addUser);
router.put('/users/:Username', usersController.authenticate(), usersController.userInputValidate(), usersController.updateUser);
router.post('/users/:Username/favorites/:MovieID', usersController.authenticate(), usersController.addUserFavoriteMovie);
router.delete('/users/:Username/favorites/:MovieID', usersController.authenticate(), usersController.removeUserFavoriteMovie);
router.delete('/users/:Username', usersController.authenticate(), usersController.removeUser);

module.exports = router;