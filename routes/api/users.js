const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

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
          // mongoose saves an instance of the newUser to the collection
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
  .catch()
})
module.exports = router
