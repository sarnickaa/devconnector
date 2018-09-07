const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//LOAD Profile and User models
const Profile = require('../../models/Profile.js')
const User = require('../../models/User.js')

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "profile works"}))

// @route   GET api/profile
// @desc    get current users profile
// @access  Private - must be logged in as route depends on token
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {}
  //fetch current users Profile
  //after login - current user data contained within req.user
  Profile.findOne({ user: req.user.id })
  // returns promise
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'there is no profile for this user'
      return res.status(404).json(errors)
    }
    // if profile found - send 200 response (default) and the profile itself as a JSON object
    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})

// @route   POST api/profile
// @desc    create or edit user profile
// @access  Private - must be logged in as route depends on token
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {}

  //get incoming fields:
  const profileFields = {}
  profileFields.user = req.user.id //avatar, name and email from logged in user

  //check to see if a field was inputted by user - if so - set it as a key/value pair on profileFields object
  if(req.body.handle) profileFields.handle = req.body.handle
  if(req.body.company) profileFields.company = req.body.company
  if(req.body.website) profileFields.website = req.body.website
  if(req.body.location) profileFields.location = req.body.location
  if(req.body.bio) profileFields.bio = req.body.bio
  if(req.body.status) profileFields.status = req.body.status
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername

  //skills: split into array - coming in as csv's
  if(typeof req.body.skills !== undefined) {
    //if it is a csv
    profileFields.skills = req.body.skills.split(',') //now an array of sills in db
  }

  // Social: social is an object on the model
  // must first initialize profileFields.social as an empty object to add to it
  profileFields.social = {}
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram

  //look for user
  Profile.findOne({user: req.user.id})
    .then(profile => {
      if(profile) {
        //UPDATE PROFILE
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        .then(profile => res.json(profile))
        //respond with the profile after update
      } else {
        //CREATE
        //check to see if handle exists i.e. SEO to access the profile page
        Profile.findOne({ handle: profileFields.handle}).then(profile => {
          if(profile) {
            errors.handle = 'that handle already exists'
            res.status(400).json(errors)
          }
          //if no matching profile found - save a new profile
          new Profile(profileFields).save()
          .then(profile => res.json(profile))
        })
      }
    })

})

module.exports = router
