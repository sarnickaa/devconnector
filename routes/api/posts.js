const express = require('express')
const router = express.Router()
const mongoose = require('mongoose') // to deal with the database
const passport = require('passport')

// Post model
const Post = require('../../models/Post.js')
// Profile
const Profile = require('../../models/Profile.js')

// validation
const validatePostInput = require('../../validation/post.js')

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "posts works"}))

// @route   GET api/posts
// @desc    get Posts
// @access  PUBLIC
router.get('/', (req, res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({nopostsfound: 'no posts found'}))
})

// @route   GET api/posts/:id get posts by id
// @desc    get Posts
// @access  PUBLIC
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({nopostfound: 'no post found with that id'}))
})

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

//PUT request for update?

// @route   DELETE api/posts/:id get posts by id
// @desc    delete posts from user
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  // find the profile of the current logged in user - only users can delete tehir own posts
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
        // check for post owner nb. req.user.id will be a string post.user is not a string
        if(post.user.toString() !== req.user.id) {
          return res.status(401).json({notauthorized: 'user not authorized to delete post'})
        }
        // DELETE
        post.remove().then(() => res.json({success: true}))
      })
      .catch(err => res.status(404).json({postnotfound: 'no post found'}))
  })
})

// @route   POST api/posts/like/:id
// @desc    like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  // find the profile of the current logged in user - only users can delete tehir own posts
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
      // has user already liked post? i.e is user id already in the array
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({alreadyliked: 'user already liked this post'})
      }

      // add user id to likes array
      post.likes.unshift({user: req.user.id})

      post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({postnotfound: 'no post found'}))
  })
})

// @route   POST api/posts/unlike/:id
// @desc    remove like from post (unlike)
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
  // find the profile of the current logged in user - only users can delete tehir own posts
  .then(profile => {
    Post.findById(req.params.id)
      .then(post => {
      // has user already liked post? i.e is user id already in the array
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({notliked: 'you have not yet liked this post'})
      }

      // remove user id to likes array
      // get remove index
      const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

      // splice out of array
      post.likes.splice(removeIndex, 1)

      // save
      post.save().then(post => res.json(post))

      })
      .catch(err => res.status(404).json({postnotfound: 'no post found'}))
  })
})

// @route   GET api/posts/comment/:id
// @desc    add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body)

  //check validation
  if(!isValid) {
    return res.status(400).json(errors)
    // if any errors send JSON with object
  }

  Post.findById(req.params.id)
  .then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }

    //add to comemnts array
    post.comments.unshift(newComment)

    //save
    post.save().then(post => res.json(post))
  })
  .catch(err => res.status(404).json({postnotfound: 'no post found'}))
})

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    remove comment on post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
  .then(post => {
    //check to see if comment exists
    if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
      return res.status(404).json({commentdoesnotexist: 'comment does not exist'})
    }

    //get remove index
    const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id)

    //splice out of array
    post.comments.splice(removeIndex, 1)
    //save
    post.save().then(post => res.json(post))
    })
  .catch(err => res.status(404).json({postnotfound: 'no post found'}))
})


module.exports = router
