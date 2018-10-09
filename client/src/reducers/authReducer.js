const initialState = {
  isAuthenticated: false,
  user: {}
}
//every reducer will export a function: that takes initial state and dispatches actions to the reducer
//action is an object that includes a type can also send data with it
export default function(state = initialState, action) {
  switch (action.type) {
      default:
        return state
  }
}
