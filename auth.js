const passport = require('passport'),
jwt = require('jsonwebtoken'),
jwtSecret = 'your_jwt_secret'; //same key as used in the JWTStrategy

require('./passport'); //local passport file evaluated (executed) whenever or at the earliest a JWTtoken is needed; If a file extension is not specified, the first thing Node will try to resolve is a .js file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, //this is the username that is being encoded in the JWT
    expiresIn: '7d', //this specifies that the token will expire in 7 days
    algorithm: 'HS256' //this is the algorithm used to sign or encode the values of the JWT
  });
}

//POST login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => { // authenticate() is called from within the route handler, rather than being used as route middleware. This gives the callback access to the req and res objects through closure. This function is used when users signs up, during which req.login() can be invoked to automatically log in the newly registered user; does not save user in the session, as bearer token sent along request everytime 
      if(error || !user){
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, {session: false}, (error) => { //used to establish a login session; does not save user in the session, as bearer token sent along request everytime 
        if(error){
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({user, token});
      }); 
    })(req, res); //continue the app's request-response cycle
  });
}