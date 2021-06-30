const passport = require('passport');
const express = require('express'),
router = express.Router(),
usersController = require('../controllers/users');

router.post('/users', usersController.validation, usersController.addUser);
router.put('/users/:Username', passport.authenticate('jwt', {session: false}), usersController.validation, usersController.updateUser);
router.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), usersController.addUserFavoriteMovie);
router.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), usersController.removeUserFavoriteMovie);
router.delete('/users/:Username', passport.authenticate('jwt', {session: false}), usersController.removeUser);

module.exports = router;