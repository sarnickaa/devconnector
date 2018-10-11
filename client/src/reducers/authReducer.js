// import { TEST_DISPATCH } from '../actions/types'
import isEmpty from '../validation/isEmpty'
import { SET_CURRENT_USER } from '../actions/types'
const initialState = {
  isAuthenticated: false,
  user: {}
}
//every reducer will export a function: that takes initial state and dispatches actions to the reducer
//action is an object that includes a type can also send data with it
export default function(state = initialState, action) {
  switch (action.type) {
    // case TEST_DISPATCH:
    //   return {
    //     //copy initial state and chage it
    //     ...state,
    //     // spread the initial state in another object (clone it)
    //     user: action.payload
    //     //fill user param with payload which is the userData
    //     // dispatching to teh reducer the data thats passed in
    //   }
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload)
        //payload passed in is obj with decoded user
        //check to see that its not empty
        //if its filled with decoded user - its authenticated if not - no authentication
        //user is the action payload itself
        // isEmpty doesn't exist - will be the same function that was defined on the server side
        // isAuthenticated will depend on wheher the payload is empty or not user will be the actual payload
        // to log out - can simply call the isEmpty function and pass an empty object - isAuthenticated will be reset to false and user will be empty object
      }
      default:
        return state
  }
}
