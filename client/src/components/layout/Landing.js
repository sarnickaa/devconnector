import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { PropTypes } from "prop-types"
//bring in proptypes because we're mapping state to properties (props)
//whenever you're using properties in your component - should add them to prop types
import { connect } from 'react-redux'


class Landing extends Component {

  componentDidMount() {
  if(this.props.auth.isAuthenticated) {
    //access to auth property which is mapped to state is granted by mapStateToProps/connect()
    this.props.history.push('/dashboard')
  }
}

  render() {
    return (
      <div className="landing">
  <div className="dark-overlay landing-inner text-light">
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1 className="display-3 mb-4">Developer Connector
          </h1>
          <p className="lead"> Create a developer profile/portfolio, share posts and get help from other developers</p>
          <hr />
          <Link to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
          <Link to="/login" className="btn btn-lg btn-light">Login</Link>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }

}

Landing.propTypes = {
  auth: PropTypes.object.isrequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})
//BRINGING IN AUTH STATE INTO THE AUTH PROPERTY

export default connect(mapStateToProps)(Landing);
