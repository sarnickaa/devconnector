const Validator = require('validator')
// module validates strings. input MUST be a string - will require logic to get around this
const isEmpty = require('./is-empty.js')

module.exports = function validateRegisterInput(data) {
  // data = object of stuff to validate = input from user from forms on frontend
  // AT THIS POINT DATA IS AN OBJECT NOT A STRING - Validator requires string input
  let errors = {}

  //changing data to strings if empty:
  data.name = !isEmpty(data.name) ? data.name : ''
  // the .isEmpty refers to the function we created - because Validator needs strings - if empty user input is returned - it would not be an empty string by default
  // would be undefined - thus - pass the data to the .isEmpty function
  // using a ternary to say if data.name is NOT empty(true) - it is just its value HOWEVER if it is empty - set its value to '' empty string
  // data.name is now passed to Validator.isLength as an empty string
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password2 = !isEmpty(data.password2) ? data.password2 : ''


  //name must be a specific length
  if(!Validator.isLength(data.name, {min: 2, max: 30})){
    //IF AN ERROR OCCURS - populate the errors object
      errors.name = 'name must be between 2 and 30 characters'
  }
  //name must not be empty
  if(Validator.isEmpty(data.name)) {
    errors.name = 'name is required'
  }


  //email must not be valid
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

  //password2 must match
  if(!Validator.equals(data.password, data.password2)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.password2 = 'passwords must match'
  }
  //password2 is required
  if(Validator.isEmpty(data.password2)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.password2 = 'confirm password is required'
  }



// return the errors object
  return {
    // errors: errors,
    errors,
    isValid: isEmpty(errors)
    // will evaluate to true or false - will run function isEmpty on the errors object
    // .isEmpty will check if opject is empty in any way - if empty - isValid set to true
    // need to check to see if this is empty
    // Validator.isEmpty will only check a string but errors in this case is an object
    // create a GLOBAL METHOD isEmpty to be able to use on anything to check if its empty (could use .isEmpty from lodash)
  }
}
