import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//mimics standard browser - allows you to use back button
import './App.css';
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'


class App extends Component {
  render() {
    return (
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
    );
  }
}

export default App;
