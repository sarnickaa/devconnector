import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
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
