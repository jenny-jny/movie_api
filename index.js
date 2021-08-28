const mongoose = require('mongoose'),
express = require('express'),
bodyParser = require('body-parser'),
morgan = require('morgan'),
cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://jenny-jny-myflix.netlify.app'];

app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) //allows requests with no origin, like mobile apps
      return callback(null, true); //error = null, allow access = true
    if(allowedOrigins.indexOf(origin) === -1){ //if a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from the origin ' + origin;
      return callback(new Error(message), false); //allow access = false
    }
    return callback(null, true); //error = null, allow access = true
  }
}));

const auth = require('./auth')(app);

const routesMovies = require('./routes/movies'),
routesUsers = require('./routes/users');

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

app.use('/movies', routesMovies);
app.use('', routesUsers);

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