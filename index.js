const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport'),
cors = require('cors'),
//import check and validationResult APIs from the package
// {check, validationResult} = require('express-validator'),
// Models = require('./models'),
routesMovies = require('./routes/movies'),
routesUsers = require('./routes/users');

// require('./passport');

const app = express();
app.use(bodyParser.json());
app.use(cors());
let auth = require('./auth')(app);

// const Movies = Models.Movie;
// const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

//logging with morgan
app.use(morgan('common'));

//serving static files
app.use(express.static('public'));

//default text response when at '/'
app.get('/', (req, res) => { //does not save user in the session, as bearer token sent along request everytime 
  res.send('Welcome to myFlix!');
});

app.use('/', routesMovies);
app.use('/', routesUsers);

//GET a list of ALL movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// //get the data of a single movie by title
// app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Movies.findOne({Title: req.params.Title}).then((movie) => {
//     res.json(movie);
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   });
// });

// //get data (descrition) about a genre by movie title 
// app.get('/movies/:Title/genre', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Movies.findOne({Title: req.params.Title}).then((movie) => {
//     res.json(movie.Genre);
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   })
// });

// //get data about a director by movie title 
// app.get('/movies/:Title/director', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Movies.findOne({Title: req.params.Title}).then((movie) => {
//     res.json(movie.Director);
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   })
// });

// //add a new user (register)
// app.post('/users', [
//   //validation logic for request here
//   check('Username', 'Username is required').isLength({min: 5}),
//   check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
//   check('Password', 'Pasword is required').not().isEmpty(), //chain methods; opposite of empty or is not empty
//   check('Email', 'Email does not appear to be valid').isEmail()
// ], (req, res) => {
//   //check the validation object for errors
//   let errors = validationResult(req);
//   if(!errors.isEmpty()){
//     return res.status(422).json({errors: errors.array()});
//   }
//   let hashedPassword = Users.hashPassword(req.body.Password);
//   Users.findOne({Username : req.body.Username}).then((user) => { //search to see if a user with the requested username already exists
//     if(user){
//       return res.status(400).send(req.body.Username + ' already exists.'); //if the user is found, send a response that it already exists
//     }else{
//       Users.create({
//         Username: req.body.Username,
//         Password: hashedPassword,
//         Email: req.body.Email,
//         Birthday: req.body.Birthday
//       }).then((user) => {
//         res.status(201).json(user);
//       }).catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//       });
//     }
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   });
// });

// //update a user's info by username
// app.put('/users/:Username', passport.authenticate('jwt', {session: false}), [
//   check('Username', 'Username is required').isLength({min: 5}),
//   check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
//   check('Password', 'Password is required').not().isEmpty(),
//   check('Email', 'Email does not appear to be valid').isEmail()
// ], (req, res) => {
//   let errors = validationResult(req);
//   if(!errors.isEmpty()){
//     return res.status(422).json({errors: errors.array()});
//   }
//   Users.findOneAndUpdate({Username: req.params.Username}, {$set: {
//     Username: req.body.Username,
//     Password: req.body.Password,
//     Email: req.body.Email,
//     Birthday: req.body.Birthday
//   }}, {new: true}, // This line makes sure that the updated document is returned 
//   (err, updatedUser) => {
//     if(err){
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     }else{
//       res.json(updatedUser);
//     }
//   });
// });

// //add a movie to the user's list of favorites
// app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Users.findOneAndUpdate({Username: req.params.Username}, {
//     $push: {FavoriteMovies: req.params.MovieID}
//   }, {new: true}, // This line makes sure that the updated document is returned 
//   (err, updatedUser) => {
//     if(err){
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     }else{
//       res.json(updatedUser);
//     }
//   });
// });

// //remove a movie from the user's list of favorites
// app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Users.findOneAndUpdate({Username: req.params.Username}, {
//     $pull: {FavoriteMovies: req.params.MovieID}
//   }, {new: true}, // This line makes sure that the updated document is returned 
//   (err, updatedUser) => {
//     if(err){
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     } else{
//       res.json(updatedUser);
//     }
//   });
// });

// //remove an existing user by username (deregister)
// app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
//   Users.findOneAndRemove({Username: req.params.Username}).then((user) => {
//     if(!user){
//       res.status(400).send(req.params.Username + ' was not found.');
//     }else{
//       res.status(200).send(req.params.Username + ' was deleted.');
//     }
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error: ' + err);
//   })
// });

//error handling
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Something broke!');
});

//listen for requests
const port = process.env.PORT || 8080; 
app.listen(port, '0.0.0.0', () => { //0.0.0.0: server will run on all interfaces available
  console.log('Listening on Port ' + port);
});