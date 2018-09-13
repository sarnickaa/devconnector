const Validator = require('validator')
// module validates strings. input MUST be a string - will require logic to get around this
const isEmpty = require('./is-empty.js')

module.exports = function validatePostInput(data) {
  // data = object of stuff to validate = input from user from forms on frontend
  // AT THIS POINT DATA IS AN OBJECT NOT A STRING - Validator requires string input
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ''

  //text length
  if(!Validator.isLength(data.text, {min: 10, max: 300})) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.text = 'post must be atleast 10 to 300 characters'
  }
  //text is required
  if(Validator.isEmpty(data.text)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.text = 'post is required'
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
