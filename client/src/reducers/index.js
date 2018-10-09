import { combineReducers } from 'redux'
import authReducer from './authReducer'

// this file just combines reducers
export default combineReducers({
  auth: authReducer
  //when used later in code anything from authReducer will be called with this.props.auth

})
