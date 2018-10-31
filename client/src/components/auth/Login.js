import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { loginUser} from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      password2: '',
      errors: {}
    }
  }

  //to prevent user being able to access login component when already logged in i.e. by typing /login into address bar
  //lifecycle method - invoked immediatley after component is mounted (inserted into DOM tree)
  componentDidMount() {
  if(this.props.auth.isAuthenticated) {
    this.props.history.push('/dashboard')
  }
}

  componentWillReceiveProps(nextProps) {
    //check if user is authenticated - action: if user validation passes
    // action sets token in local localStorage
    // reducer sets isAuthenticated to true in app state
    // thus test to see is isAuthenticatedtrue

    if(nextProps.auth.isAuthenticated) {
      // auth = the state object from the authreducer (established through the reducers index.js file which combines reducers)
      // if true - redirect to dashboard
      this.props.history.push('/dashboard')
    }
    if(nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email: this.state.email,
      password: this.state.password
    }

    //call the reduc action for submit:
    this.props.loginUser(userData)
  }

  render() {
    const { errors } = this.state
    //come in as properties from the reducer
    //use componentWillReceiveProps to map it back to state
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form
                onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  />
                 <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                  />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(Login); //connecting component to redux, 1st param = mapstatetoprops loginUser is the action we want to call from the actions file
