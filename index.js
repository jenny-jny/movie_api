const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let movies = [
  {
    title: 'Casablanca',
    director: 'Michael Curtiz',
    genre: 'Romance'
  },
  {
    title: 'Up',
    director: 'Pete Docter',
    genre: 'Family'
  },
  {
    title: 'Slumdog Millionaire',
    director: 'Danny Boyle',
    genre: 'Drama'
  },
  {
    title: 'Gaslight',
    director: 'George Cukor',
    genre: 'Noir'
  },
  {
    title: 'Titanic',
    director: 'James Cameron',
    genre: 'Romance'
  },
  {
    title: 'La La Land',
    director: 'Damien Chazelle',
    genre: 'Musical'
  },
  {
    title: 'The Great Gatsby',
    director: 'Baz Luhrmann',
    genre: 'Romance'
  },
  {
    title: 'Once Upon A Time in Hollywood',
    director: 'Quentin Tarantino',
    genre: 'Comedy'
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    genre: 'Drama'
  },
  {
    title: 'Gone with the Wind',
    director: 'Victor Fleming',
    genre: 'Romance'
  }
];

//logging with morgan
app.use(morgan('common'));

//serving static files
app.use(express.static('public'));

//GET a list of ALL movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

//get the data of a single movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title;
  }));
});

//get data about a genre by movie title
app.get('/movies/:title/genre', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.title ===req.params.title;
  });
  if(movie){
    res.status(201).send(movie.genre);
  }else{
    res.status(404).send('Movie with name ' + req.params.title + ' was not found.');
  }
});

//get data about a director by title and director's name
app.get('/movies/:title/:director', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.director ===req.params.director;
  });
  if(movie){
    res.status(201).send(movie.director + ' bio, birth year, death year...');
  }else{
    res.status(404).send('Movie with director ' + req.params.director + ' was not found.');
  }
});

//add a new user (register)
app.post('/users', (req, res) => {
  let newUser = req.body;
  if(!newUser.userEmail){
    const message = 'Missing user e-mail in request body';
    res.send(400).send(message);
  }else{
    res.status(202).send(newUser);
  }
});

//update a user's info (username) by user's email
app.put('/users/:userEmail/:username', (req, res) => {
  res.send('Successful PUT request updating user\'s username');
});

//add a movie to the user's list of favorites	
app.post('/users/:username/favorites', (req, res) => {
  res.send('Successful POST request adding a movie to the user\'s list of favorites')
});

//remove a movie from the user's list of favorites
app.delete('/users/:username/favorites/:movie', (req, res) => {
  res.send('Successful DELETE request removing a movie from the user\'s list of favorites')
});

//remove an existing user by the user's email (deregister)	
app.delete('/users/:userEmail', (req, res) => {
  res.send('Successful DELETE request removing an existing user');
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