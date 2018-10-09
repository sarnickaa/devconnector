// import { TEST_DISPATCH } from '../actions/types'
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
 
      default:
        return state
  }
}
