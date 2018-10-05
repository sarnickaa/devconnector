import React, { Component } from 'react';
import axios from 'axios'
import classnames from 'classnames'
// allows conditional classes to be applied to elements

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
    //where the request is made will change after redux is implemented
    axios.post('/api/users/register', newUser)
    //returns promise
    //because proxy value is in package.json - don;t have to put URL in
    .then(res => console.log(res.data))
    .catch(err => this.setState({errors: err.response.data}))
  }


  render() {
    const { errors } = this.state
    // destructuring: same as const errors = this.state.errors
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form
                onSubmit={this.onSubmit}>
                <div className="form-group">
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
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.email
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange} />
                    { errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange} />
                    { errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password2
                    })}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}/>
                    { errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Register;
