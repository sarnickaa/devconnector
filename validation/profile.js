const Validator = require('validator')
const isEmpty = require('./is-empty.js')

module.exports = function validateProfileInput(data) {
  // data = object of stuff to validate
  let errors = {}

  // empty form input will not be an empty string - will be null/undefined - must be converted to string format
  // if data.handle IS null/undefined - isEmpty(null) - resolves to true !isEmpty - if it has a value - remains at value - if not not undefined (i.e. undefined) set to empty string
  data.handle = !isEmpty(data.handle) ? data.handle : ''
  data.status = !isEmpty(data.status) ? data.status : ''
  data.skills = !isEmpty(data.skills) ? data.skills : ''

  //handle must be valid length
  if(!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'handle needs to be between 2 and 40 characters'
  }
  //handle must not be empty
  if(Validator.isEmpty(data.handle)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.handle = 'profile handle is required'
  }

  //handle must not be empty
  if(Validator.isEmpty(data.status)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.status = 'status field is required'
  }

  //status must not be empty
  if(Validator.isEmpty(data.skills)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.skills = 'skills field is required'
  }

// check validity of website and social networks
  if(!isEmpty(data.website)){
  //if NOT is empty i.e. if not null or undefined
    if(!Validator.isURL(data.website)) {
      errors.website = 'not a valid URL'
    }
}

if(!isEmpty(data.youtube)){
//if NOT is empty i.e. if not null or undefined
  if(!Validator.isURL(data.youtube)) {
    errors.youtube = 'not a valid URL'
  }
}

if(!isEmpty(data.twitter)){
//if NOT is empty i.e. if not null or undefined
  if(!Validator.isURL(data.twitter)) {
    errors.twitter = 'not a valid URL'
  }
}

if(!isEmpty(data.facebook)){
//if NOT is empty i.e. if not null or undefined
  if(!Validator.isURL(data.facebook)) {
    errors.facebook = 'not a valid URL'
  }
}

if(!isEmpty(data.linkedin)){
//if NOT is empty i.e. if not null or undefined
  if(!Validator.isURL(data.linkedin)) {
    errors.linkedin = 'not a valid URL'
  }
}

if(!isEmpty(data.instagram)){
//if NOT is empty i.e. if not null or undefined
  if(!Validator.isURL(data.instagram)) {
    errors.instagram = 'not a valid URL'
  }
}

  return {
    // errors: errors,
    errors,
    isValid: isEmpty(errors)
    // need to check to see if this is empty - VALID if errors are empty
    // Validator.isEmpty will only check a string but errors in this case is an object
    // create a GLOBAL METHOD isEmpty to be able to use on anything to check if its empty (could use .isEmpty from lodash)
  }
}
