const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys.js')
const passport = require('passport')

//load input validation
const validateRegisterInput = require('../../validation/register.js')
const validateLoginInput = require('../../validation/login.js')


// load User model
const User = require('../../models/User.js')

// @route   GET api/users/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "users works"}))

// @route   POST api/users/register
// @desc    register user
// @access  Public
router.post('/register', (req, res) => {
// before the POST request (or any request that takes in data from the user) runs - pull out errors & isValid from validateRegisterInput function through destructuring
// destructuring: unpacks the values assigned to the keys into matching variables
  // validateRegisterInput() returns an object with keys errors, isValid
  // const { errors, isValid } = validateRegisterInput = that object = assigns those values to the variables
// runs validateRegisterInput function on everything that is sent to this route
// THEN pulls out the errors/isValid objects and check them to see if user input passed validation before starting POST request
const { errors, isValid } = validateRegisterInput(req.body)
console.log(isValid) // will return true or false - if error object is empty - will be set to true
console.log(errors)

//check first line of validation - is the input itself valid before checking against database below
if(!isValid) {
  // IF NOT VALID/NOT TRUE - this means there are errors
  return res.status(400).json(errors) // sending whole errors object - if validation fails - this object will be filled with the erros defined in validation function
}


  // check to see that email doesn't already exist
  User.findOne({ email: req.body.email })
  // requiring bodyParser in server.js allows access to req.body
  // returns a promise that must be resolved
  .then(user => {
    if(user) {
      errors.email = 'email already exists'
      //errors object from above. Because validation passed - object is empty
      // assign 'email' as a key and set error message as its value

      // if email exists - send a custom error
      console.log(errors)
      return res.status(400).json(errors) // errors at this point is object with 1 key {email: 'error message'}

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

  const { errors, isValid } = validateLoginInput(req.body)

  //check first line of validation - is the input itself valid before checking against database below
  if(!isValid) {
    // IF NOT VALID or any errors
    return res.status(400).json(errors) // sending whole errors object - if validation fails - this object will be filled with the erros defined in validation function
  }

  const email = req.body.email
  const password = req.body.password

  // find user with their email
  // User.findOne({email: email})
  User.findOne({email})
    .then(user => {
      if(!user) {
        errors.email = "User not found"
        return res.status(404).json(errors)
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
          errors.password = 'password incorrect'
          return res.status(400).json(errors)
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
