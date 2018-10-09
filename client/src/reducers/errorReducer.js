import { GET_ERRORS } from '../actions/types'
const initialState = {}
//every reducer will export a function: that takes initial state and dispatches actions to the reducer
//action is an object that includes a type can also send data with it
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload
      // payload will include err.response.data (as defined in authActions)
      // putting this errors object int redux state
    default:
        return state
  }
}
