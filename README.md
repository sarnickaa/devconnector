## Basic Redux Workflow:
The rootReducer is a combination of all the separate reducer functions in your app that is then passed to the createStore function.

https://redux.js.org/api/combinereducers

In the file structure - the rootReducer is located in the index.js file (in the 'reducers' directory).It is then imported by store.js and is used as the first argument for the createStore function. The stores initial state is determined by the rootReducer (any reducer generally) and the root Reducer will also determine how the apps state will change in response to whatever actions are fired off.

Thunk is a middleware (basically a package of functions) that extend the capacity of redux actions to allow you to make asynch requests.

https://daveceddia.com/what-is-a-thunk/

Redux actions generally just return JS objects. They don't really 'do' anything, they're just payloads of data that get sent (through reducers) to update application state.

To allow a redux action to make an asynch request (like a HTTP GET/POST/PATCH/DELETE request) the action has to be more than just an object - the action has to both return and call a function - this is where Thunk comes in. If you use Thunk - it will scan all the actions coming into your store, if they are structured to return a function, the middleware invokes that function, making the asynch request and allows you to access the dispatch method to send any data to the store to update state.

Thunk is implemented in the code at the store level through the compose/applyMiddleware methods.
