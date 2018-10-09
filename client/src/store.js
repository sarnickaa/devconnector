import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers' // because root reducer is called index.js - don;t actually ahve to speciy it explicitly

const initialState = {}
const middleware = [thunk]

// const store = createStore(() => [], {}, applyMiddleware(...middleware))
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // IMPLEMENT THE REDUX DEVTOOLS EXTENSION
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 )
)


export default store
