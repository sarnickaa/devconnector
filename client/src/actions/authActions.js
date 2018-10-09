//registration - call the action and redirect to loginpage
//this does not require any return unless there is an error - which would dispatch a get Errors action to the errors reducer
import axios from 'axios'
// import { TEST_DISPATCH } from './types'
import { GET_ERRORS } from './types'

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
