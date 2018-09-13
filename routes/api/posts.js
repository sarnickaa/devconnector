const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') // to deal with the database
const passport = require('passport')

// Post model
const Post = require('../../models/Post.js')

// validation
const validatePostInput = require('../../validation/post.js')

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "posts works"}))

// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  //check validation
  if(!isValid) {
    return res.status(400).json(errors)
    // if any errors send JSON with object
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })

  newPost.save().then(post => res.json(post))
})

module.exports = router
