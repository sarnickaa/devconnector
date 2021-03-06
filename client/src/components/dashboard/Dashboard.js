import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types'
import { getCurrentProfile } from '../../actions/profileActions'

// function mapStateToProps(state) {
//     return {

//     };
// }

class Dashboard extends Component {
    //want the getCurrentProfile action to be called right away - use lifecycle method:
    componentDidMount() {
        this.props.getCurrentProfile()
    }
    
    render() {
        return (
            <div>
                <h1>Dashboard</h1>   
            </div>
        );
    }
}

export default connect(
    null,
    { getCurrentProfile }
)(Dashboard);