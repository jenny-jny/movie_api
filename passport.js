const Models = require('./models.js'),
Users = Models.User;

const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({ //before asking Passport to authenticate a request, the strategy (or strategies) used by an application must be configured. Strategies, and their configuration, are supplied via the use() function.
  usernameField: 'Username', //parses credentials contained in the request
  passwordField: 'Password' //parses credentials contained in the request
}, (username, password, callback) => { //then invokes verify (authentication) callback with credentials as arguments
  console.log(username + ' ' + password);
  Users.findOne({Username: username}, (error, user) => {
    if(error){
      console.log(error);
      return callback(error); //server exception (error)
    }
    if(!user){
      console.log('Incorrect username');
      return callback(null, false, {message: 'Incorrect username'}); //error = null, user = false
    }
    if(!user.validatePassword(password)){
      console.log('Incorrect pasword');
      return callback(null, false, {message: 'Incorrect password'}); //error = null, user = false
    }
    console.log('Finished');
    return callback(null, user); //error = null
  })
}));

passport.use(new JWTStrategy({ //before asking Passport to authenticate a request, the strategy (or strategies) used by an application must be configured. Strategies, and their configuration, are supplied via the use() function.
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //parses credentials contained in the request
  secretOrKey: 'your_jwt_secret' //parses credentials contained in the request
}, (jwtPayload, callback) => { //then invokes verify (authentication) callback with credentials as arguments. jwt_payload is an object literal containing the decoded JWT payload.
  return Users.findById(jwtPayload._id).then((user) => { //when a promise is resolved, it can optionally return a value. This piece of data is assigned to the parameters of the callback function in .then(). A promise is a returned object to which you attach callbacks, instead of passing callbacks into a function. 
    return callback(null, user); //error = null
  }).catch((error) => {
    return callback(error); //server exception (error)
  });
}));