//registration - call the action and redirect to loginpage
//this does not require any return unless there is an error - which would dispatch a get Errors action to the errors reducer
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
// import { TEST_DISPATCH } from './types'
import { GET_ERRORS, SET_CURRENT_USER } from './types'



//REGISTER USER ACTION:
//IF YOU WANT TO DISPATCH SOMETHING TO A REDUCER MUST RETURN AN OBJECT WITH A TYPE
export const registerUser = (userData, history) => dispatch => {
// dispatch is a nested function
// history is the router-specific this.props.history prop that is being passed to this action when it is invoked in the Register component
// will allow you to redirect from within an action on the success of the axios call

  // return {
  //   type: TEST_DISPATCH,
  //   payload: userData
  // }

  //thunk middle ware for asynch actions
  axios.post('/api/users/register', userData)
  .then(res => history.push('/login'))
  // redirecting from an action - from within an action, cant use this.props.hostory.push('path')
  .catch(err =>
  //making an axios call and waiting for response - thus can't just return type/payload - have to call dispatch method to actually pass to reducer
  //dispatch method accessed through redux-thunk middleware
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
    //dispatching an action type to get errors
  )
}


// LOGIN USER ACTION - get user token
export const loginUser = userData => dispatch => {
axios.post('/api/users/login', userData)
  .then(res => {
    // save to local storage
    const { token } = res.data
    // set token to local storage
    localStorage.setItem('jwtToken', token)
    //local storage only stores strings
    //set token to auth header
    setAuthToken(token) // function created in a separate file

    // set the user - in auth state have a user object that needs to be filled
    // right now token is bearer token (long string) which includes user info i.e. name/avatar/etc to decode need the jwtDecode module to extract that info

    //decode token to get user data
    const decoded = jwt_decode(token) // will have user data + issued at and exp of token

    // set current user on application state
    dispatch(setCurrentUser(decoded))
})
.catch(err =>
  dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

//set logged in user action
export const setCurrentUser = decoded => {
// just dispatching to reducer
return {
  type: SET_CURRENT_USER,
  payload: decoded
}
}
