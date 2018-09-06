const Validator = require('validator')
// module validates strings. input MUST be a string - will require logic to get around this
const isEmpty = require('./is-empty.js')

module.exports = function validateLoginInput(data) {
  // data = object of stuff to validate = input from user from forms on frontend
  // AT THIS POINT DATA IS AN OBJECT NOT A STRING - Validator requires string input
  let errors = {}

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  //email must be valid
  if(!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid'
  }
  //email must not be empty
  if(Validator.isEmpty(data.email)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.email = 'email is required'
  }

  //password length
  if(!Validator.isLength(data.password, {min: 2, max: 30})) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.password = 'password must be atleast 2 and 30 characters'
  }
  //password is required
  if(Validator.isEmpty(data.password)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.password = 'password is required'
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
