import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'

// this file just combines reducers
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
  //when used later in code anything from authReducer will be called with this.props.auth - the state that shows up in redux dev console

})
