const Validator = require('validator')
// module validates strings. input MUST be a string - will require logic to get around this
const isEmpty = require('./is-empty.js')

module.exports = function validateExperienceInput(data) {
  // data = object of stuff to validate = input from user from forms on frontend
  // AT THIS POINT DATA IS AN OBJECT NOT A STRING - Validator requires string input
  let errors = {}

  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  //title must not be empty
  if(Validator.isEmpty(data.title)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.title = 'job title is required'
  }

  //company must not be empty
  if(Validator.isEmpty(data.company)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.company = 'company is required'
  }

  //from must not be empty
  if(Validator.isEmpty(data.from)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.from = 'from date is required'
  }

  return {
    // errors: errors,
    errors,
    isValid: isEmpty(errors)
    // need to check to see if this is empty
    // Validator.isEmpty will only check a string but errors in this case is an object
    // create a GLOBAL METHOD isEmpty to be able to use on anything to check if its empty (could use .isEmpty from lodash)
  }
}
