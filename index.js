const express = require('express'),
morgan = require('morgan');

const app = express();

let topMovies = [
  {
    title: 'Casablanca'
  },
  {
    title: 'Up'
  },
  {
    title: 'Slumdog Millionaire'
  },
  {
    title: 'Gaslight'
  },
  {
    title: 'Titanic'
  },
  {
    title: 'The Matrix'
  },
  {
    title: 'The Great Gatsby'
  },
  {
    title: 'Once Upon A Time in Hollywood'
  },
  {
    title: 'Forrest Gump'
  },
  {
    title: 'Gone with the Wind'
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