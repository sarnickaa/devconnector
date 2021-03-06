const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//load validation
const validateProfileInput = require('../../validation/profile.js')
const validateExperienceInput = require('../../validation/experience.js')
const validateEducationInput = require('../../validation/education.js')



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
  .populate('user', ['name', 'avatar'])
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

// @route   GET api/profile/all
// @desc    GET all profiles
// @access  PUBLIC - anyone can see profiles
router.get('/all', (req, res) => {
  const errors = {}

  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) {
      errors.noprofile = 'there there are no profiles'
      return res.status(404).json(errors)
    }
    res.json(profiles)
})
  .catch(err =>
    res.status(404).json({ profile: 'there are no profiles'})
  )
})

// @route   GET api/profile/handle/:handle (nb handle word will not be in front end URL)
// @desc    get profile by handle
// @access  PUBLIC - anyone can see profiles
router.get('/handle/:handle', (req, res) => {
  const errors = {}

  Profile.findOne({ handle: req.params.handle })
  //req.params.handle will match whatever :handle is in the URL
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'there is no profile for this user'
      // send error once created
      res.status(404).json(errors)
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json(err))
})

// @route   GET api/profile/user/:user_id get profile by userID
// @desc    get profile by user id
// @access  PUBLIC - anyone can see profiles
router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Profile.findOne({ user: req.params.user_id })
  //req.params.handle will match whatever :handle is in the URL
  .populate('user', ['name', 'avatar'])
  .then(profile => {
    if(!profile) {
      errors.noprofile = 'there is no profile for this user'
      // send error once created
      res.status(404).json(errors)
    }

    res.json(profile)
  })
  .catch(err => res.status(404).json({profile: 'there is no profile for this user'}))
  // if an error occurs with the id i.e. wrong id - the .catch() error will be sent in this case rather than in th handle - where the custom error shows
})

// @route   POST api/profile
// @desc    create or edit user profile
// @access  Private - must be logged in as route depends on token
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  // const errors = {}

  const { errors, isValid } = validateProfileInput(req.body)

  //check validation
  if(!isValid) {
    //RETUR ANY ERRORS with 400 status
    return res.status(400).json(errors)
  }

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

// @route   POST api/profile/experience
// @desc    POST experience to experience array
// @access  PRIVATE
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateExperienceInput(req.body)

  //check validation
  if(!isValid) {
    //RETUR ANY ERRORS with 400 status
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id}) // find by logged in user - user.id comes from the logged in users token
  .then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

  // add to experience array
  profile.experience.unshift(newExp)
  profile.save().then(profile => res.json(profile)) // add the profile to begining of array
  // will return the profile through the promise
  })
})

// @route   POST api/profile/education
// @desc    POST education to education array
// @access  PRIVATE
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateEducationInput(req.body)

  //check validation
  if(!isValid) {
    //RETUR ANY ERRORS with 400 status
    return res.status(400).json(errors)
  }

  Profile.findOne({user: req.user.id}) // find by logged in user - user.id comes from the logged in users token
  .then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

  // add to experience array
  profile.education.unshift(newEdu)
  profile.save().then(profile => res.json(profile)) // add the profile to begining of array, save and return profile
  // will return the profile through the promise
  })
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE experience in experience array
// @access  PRIVATE
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({user: req.user.id}) // find by logged in user - user.id comes from the logged in users token
  .then(profile => {
    //Get remove index
    const removeIndex = profile.experience // an array
    .map(item => item.id)
    .indexOf(req.params.exp_id)

    // splice out of array
    profile.experience.splice(removeIndex, 1)

    // resave profiles
    profile.save().then(profile => res.json(profile))
  })
  .catch(err => res.status(404).json(err))
})

// @route   DELETE api/profile/education/:edu_id
// @desc    DELETE education in education array
// @access  PRIVATE
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({user: req.user.id}) // find by logged in user - user.id comes from the logged in users token
  .then(profile => {
    //Get remove index
    const removeIndex = profile.education // an array
    .map(item => item.id) // map the item to the id
    .indexOf(req.params.edu_id)

    // splice out of array
    profile.education.splice(removeIndex, 1)

    // resave profiles
    profile.save().then(profile => res.json(profile))
  })
  .catch(err => res.status(404).json(err))
})

// @route   DELETE api/profile
// @desc    DELETE user and profile
// @access  PRIVATE
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
  .then(() => {
    User.findOneAndRemove({ _id: req.user.id})
    .then(() => res.json({ success: true})
    )
  })
})

module.exports = router
