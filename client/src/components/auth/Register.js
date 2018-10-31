import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
// wrap register component with this when you export it

// import axios from 'axios'
// import classnames from 'classnames'
// allows conditional classes to be applied to elements
import { connect } from 'react-redux' // connects redux with react components
import { registerUser } from '../../actions/authActions'//the redux action
import TextFieldGroup from '../common/TextFieldGroup'

class Register extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }
    // this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
  if(this.props.auth.isAuthenticated) {
    this.props.history.push('/dashboard')
  }
}

//test for errors property - to see if component has recieved errors
// lifecycle method
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
      //set the recieved errors (from redux state) as the state on the component
    }
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault()
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }
    this.props.registerUser(newUser, this.props.history)
    //any action that are brought in through the connect() redux method at bottom of component -  are stored in props - allows access to regiserUser action
    //because withRouter wraps the register component - able to pass router props i.e. this.props.history to the registerUser action


    //where the request is made will change after redux is implemented
    // axios.post('/api/users/register', newUser)
    // //returns promise
    // //because proxy value is in package.json - don;t have to put URL in
    // .then(res => console.log(res.data))
    // .catch(err => this.setState({errors: err.response.data}))
  }


  render() {
    const { errors } = this.state
    // destructuring: same as const errors = this.state.errors

    // const { user } = this.props.auth
    return (
      <div className="register">
        {/* { user ? user.name : null } */}
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form
                onSubmit={this.onSubmit}>
                {/* <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                    //first param to classnames method = default classes that will always exist
                    //second param 'is-invalid' will only be applied IF errors.name exists
                    //errors.name comes from state. it is filled when the axios request is made ONLY IF an error exists
                    // the errors object is created through the validations on the back end
                      'is-invalid': errors.name
                    })}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange} />
                    { errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                    {/* invalid-feedback is a bootstrap class for displaying error messages if an imput recieves invalid data */}
                    {/* error message is generated on the back end and sent along with the 400 response */}
                {/* </div> */}

                <TextFieldGroup
                  placeholder="name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  />

                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                  />

                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                  />
      
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
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

//mapping prop types (coming from redux and being used in a component)
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
//with redux - if you want to get any of the authState into the component - a map() function will be REQUIRED
//auth-state is put in a property called auth so it can be accesseed with this.props.auth

const mapStateToProps = (state) => ({
auth: state.auth,
errors: state.errors
//this comes from root reducer
})

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
// second param is the action/object where you can map your actions
