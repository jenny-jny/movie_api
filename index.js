const express = require('express'),
morgan = require('morgan');

const app = express();

let topMovies = [
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

//GET requests
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//serving static files
app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});