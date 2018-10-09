//registration - call the action and redirect to loginpage
//this does not require any return unless there is an error - which would dispatch a get Errors action to the errors reducer
import { TEST_DISPATCH } from './types'
//IF YOU WANT TO DISPATCH SOMETHING TO A REDUCER MUST RETURN AN OBJECT WITH A TYPE
export const registerUser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  }
}
