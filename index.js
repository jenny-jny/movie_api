const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Models = require('./models');

const app = express();
app.use(bodyParser.json());

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true});

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

//GET a list of ALL movies DONE
app.get('/movies', (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get the data of a single movie by title DONE
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({Title: req.params.Title}).then((movie) => {
    res.json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get data (descrition) about a genre by genre name/title
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

//get data about a director by name (director) and title
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

//add a new user (register) DONE
/* we’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
*/
app.post('/users', (req, res) => {
  Users.findOne({Username : req.body.Username}).then((user) => {
    if(user){
      return res.status(400).send(req.body.Username + ' already exists.');
    }else{
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {
        res.status(201).json(user);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//update a user's info by username DONE
/* we’ll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}), {$set: {
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
    Birthday: req.body.Birthday
  }}, {new: true}, // This line makes sure that the updated document is returned 
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }else{
      res.json(updatedUser);
    }
  }
});

//add a movie to the user's list of favorites	DONE
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}), {
    $push: {FavoriteMovies: req.params.MovieID}
  }, {new: true}, // This line makes sure that the updated document is returned 
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }else{
      res.json(updatedUser);
    }
  }
});

//remove a movie from the user's list of favorites DONE
app.delete('/users/:Username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}), {
    $pull: {FavoriteMovies: req.params.MovieID}
  }, {new: true}, // This line makes sure that the updated document is returned 
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else{
      res.json(updatedUser);
    }
  }
});

//Delete an existing user by username (deregister) DONE
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username}).then((user) => {
    if(!user){
      res.status(400).send(req.params.Username + ' was not found.');
    }else{
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
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