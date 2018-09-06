const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys.js')
const passport = require('passport')

// load User model
const User = require('../../models/User.js')

// @route   GET api/users/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "users works"}))

// @route   GET api/users/register
// @desc    register user
// @access  Public
router.post('/register', (req, res) => {
  // check to see that email doesn't already exist
  User.findOne({ email: req.body.email })
  // requiring bodyParser in server.js allows access to req.body
  // returns a promise that must be resolved
  .then(user => {
    if(user) {
      // if email exists - send a custom error
      return res.status(400).json({email: 'email already exists'})
    } else {

      // create an avatar by using a gravatar email
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size of avatar
        r: 'pg', // image rating
        d: 'mm' // displays a default image icon if email is not gravatar
      })

      // create a new instance of the User schema based on the req.body params
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        // avatar: avatar,
        password: req.body.password
      })

      // encrypt the password before saving it in the users collection
      bcrypt.genSalt(10, (err, salt) => {
        // generate a salt
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // generates a hash based on the newUser.password param
          if(err) throw error
          newUser.password = hash
          // sets the users password as the hash

          newUser.save()
          // mongoose saves an instance of the newUser to the collection with a hashed password
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
  .catch()
})

// @route   GET api/users/login
// @desc    Login user - returning JWT token
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // find user with their email
  // User.findOne({email: email})
  User.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(404).json({email: 'user email not found'})
        //the json object attribute is important here as it will be used on the front end later
      }

      // check password - password that user types in against the hashed saved password on the user record
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        //check for match
        if(isMatch) {
          // user matched

          // create jwt payload to send to jwtStrategy for token generation
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          }

          // sign the token(make the token)- takes payload of user info to include the token + secret/key + expiration
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            // token will expire in an hour - user will have to log in again

            //.sign takes callback if the action is asynchronous - calls the function with either an error or the generated JWT
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
                // adds the bearer scheme header
              })
            })
        } else {
          return res.status(400).json({password: 'password incorrect'})
        }
    })
  })
})

// @route   GET api/users/current
// @desc    return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  //passport.authenticate takes the strategy thats to be used as the first param and applies it to that route - route is now protected
  // the supplied callback is used if the authentication strategy passed successfully - req.user will contain the authenticated users
  // by default if authentication strategy fails - 401 Unauthorized status returned
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router
