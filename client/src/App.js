import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'
//mimics standard browser - allows you to use back button
import { Provider } from 'react-redux'
// react component that provides application with the store that will store app state
import './App.css';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import store from './store'

//check for token:
if(localStorage.jwtToken){
//set auth token header auth
setAuthToken(localStorage.jwtToken)
//takes in token stored in local storage and sets header

//decode token and get user info and expiration = same process as in Login action
//except checking for this with every page request - now no matter what page you go to - user will always exist in state
const decoded = jwt_decode(localStorage.jwtToken)
//call setCurrentUser action - to set user and isAuthenticated
store.dispatch(setCurrentUser(decoded))
//can call any action with store.dispatch

//check for expired TOKEN - logout user and redirect to login page
  const currentTime = Date.now() / 1000 //miliseconds
  if(decoded.exp < currentTime) {
  // logout user
  store.dispatch(logoutUser())
  //TODO clear current profile

  //redirect to login
  window.location.href = '/login'
}

}

class App extends Component {
  render() {
    return (
  <Provider store={ store }>
    {/* uses the createStore method
    takes in 3 things:
    1. reducer - root reducer cotains all sub reducers
    2. preloaded state = any initial state you want to add
    3. enhancer - this is where middleware is applied and redux chrome extension */}
    <Router>
      <div className="App">
        <Navbar />
        <Route path="/" exact component={ Landing } />
        <div className="container">
          <Route path="/register" exact component={ Register } />
          <Route path="/login" exact component={ Login } />
        </div>
        <Footer />
      </div>
    </Router>
  </Provider>
    );
  }
}

export default App;
