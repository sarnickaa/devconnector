const isEmpty = value => {
  return(
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    //Object.keys(value).length === 0 checks for empty object i.e. number of keys on value(object) is 0
    (typeof value === 'string' && value.trim().length === 0)
    //checks for empty string
  )
  // function will return TRUE for these conditions - thus - is used with the ! operator in the ternary i.e. if value is NOT undefined or null...will  remain. IF undefined/null - will be set to ''
}

module.exports = isEmpty
