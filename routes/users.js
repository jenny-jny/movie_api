const express = require('express'),
router = express.Router(),
usersController = require('../controllers/users');

//userInputValidate() and authenticate() because needs to be immediately called, unlike getMovies, which is an asynch function
router.post('/', usersController.userInputValidate(), usersController.addUser);
router.put('/:Username', usersController.authenticate(), usersController.userInputValidate(), usersController.updateUser);
router.post('/:Username/favorites/:MovieID', usersController.authenticate(), usersController.addUserFavoriteMovie);
router.delete('/:Username/favorites/:MovieID', usersController.authenticate(), usersController.removeUserFavoriteMovie);
router.delete('/:Username', usersController.authenticate(), usersController.removeUser);

module.exports = router;