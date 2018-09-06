const JwtStrategy = require('passport-jwt').Strategy
// defines an authorization strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
// allows extraction of the payload/user data from the request
const mongoose = require('mongoose')
const User = mongoose.model('users')
// 'users' comes from the module.exports syntax of the User Schema
const keys = require('../config/keys')

const opts = {}
// an object literal passed to new JwtStrategy(opts, verify) to control how token is extracted and verified
// verify is a function with 2 params(jwt_payload, done)
// jwt_payload = object literal containing the decoded/readable info sent to create the token
// done = a callback function that accepts arguments (error, user, info)

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// this is REQUIRED - is a function that will accept the request as a param and returns the token as a string or null
// this function is created through ExtractJwt = known as an extractor
// .fromAuthHeaderAsBearerToken() creates an extractor that specifically looks for the token when the authorization header has Bearer specified
// requires that a user has a TOKEN
opts.secretOrKey = keys.secretOrKey
// secretOrKey is a string or buffer for verifying the token. the secretOrKey was used in jwt.sign() when the token was created

module.exports = (passport) => {
  // in server.js passport was passed as a param
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    // jwt_payload = the payload sent to jwt.sign()
    // once user data is extracted - find the user and validate
    User.findById(jwt_payload.id)
    // find user by the id contained in the jwt_payload
    .then(user => {
      if(user) {
        // if user found - return the 'done' function that is passed as a param to the new JwtStrategy
        // 1st param of done() - error (since none, its null) 2nd param is the user
        return done(null, user)
      }
        return done(null, false)
        // if no user is found
      })
    .catch(err => console.log(err))
    })
  )
}

// this entire strategy basically checks to see if a user has a valid token.
// when an API call is made by the user through the App - their token is sent with it
// this verification strategy checks to see if that token exists - if so - they are allowed to access that route
