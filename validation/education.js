const Validator = require('validator')
// module validates strings. input MUST be a string - will require logic to get around this
const isEmpty = require('./is-empty.js')

module.exports = function validateExperienceInput(data) {
  // data = object of stuff to validate = input from user from forms on frontend
  // AT THIS POINT DATA IS AN OBJECT NOT A STRING - Validator requires string input
  let errors = {}

  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.from = !isEmpty(data.from) ? data.from : ''
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''

  //title must not be empty
  if(Validator.isEmpty(data.school)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.school = 'school is required'
  }

  //title must not be empty
  if(Validator.isEmpty(data.degree)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.degree = 'degree is required'
  }

  //title must not be empty
  if(Validator.isEmpty(data.from)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.from = 'from date is required'
  }

  //title must not be empty
  if(Validator.isEmpty(data.fieldofstudy)) {
    //IF AN ERROR OCCURS - populate the errors object
      errors.fieldofstudy = 'field of study is required'
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
