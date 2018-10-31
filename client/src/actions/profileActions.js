//create action get current profile - to hit api/profile endpoint to get that logged in users profile

import axios from 'axios'
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types'

//get current profile

//nb - this is a curried function i.e. 2 arrows in a line = returns everything behind the first arrow 
// getCurrentProfile returns dispatch function
export const getCurrentProfile = () => dispatch => {
    //dispatch an action here to set profile loading state:
    dispatch(setProfileLoading())
    axios.get('/api/profile')
    //when endpoint is hit - if profile found will call GET_PROFILE (the case in the reducer), there the profile attribute of the state object will be filled with the action's payload (res.data = the profile) loading set to true
    .then(res => 
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        }))
    .catch(err => 
        //if there isn't a profile - no error cause its ok to not find a profile - thus not using GET_ERRORS
        //return an empty object/empty profile and prompt to create a profile - will just cause the dashboard to render a bit differently
        dispatch({
            type: GET_PROFILE,
            payload: {}
        }))
}

//profile loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

//clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}