//using axios defults to set default header
import axios from 'axios'

const setAuthToken = token => {
  if(token) {
    //apply to every request
    axios.defaults.headers.common['Authorization'] = token
  } else {
    //delete auth header if token not there
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken
