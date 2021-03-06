// ES6 import syntax, works similar to a node 'require' statement
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {App, AppContainer} from './components/App';
import {SignIn, SignInContainer} from './components/SignIn';
import {SignUp, SignUpContainer} from './components/SignUp';
import {EncounterList, EncounterListContainer} from './components/EncounterList';
import {EncounterListEntry, EncounterListEntryContainer} from './components/EncounterListEntry';
import {NewEncounterContainer} from './components/NewEncounter';
import {UserProfileContainer} from './components/UserProfile';
import {NavContainer} from './components/Nav';
import {EncounterDetailsContainer} from './components/EncounterDetails';
import auth from './lib/auth.js';
import enc from './lib/encounter.js';
// in ES6 you can assign variables from an object using 
// what are called "Destructuring"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment 
import {Router, Route, Link, hashHistory} from 'react-router';
import {List, Map} from 'immutable';

// A reducer is a function which takes the state, and an action, and
// returns a new state based on the action. All reducer functions
//   1) MUST BE pure functions, see http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/
//   2) MUST return a state, even if the state is empty or the same
//   3) MUST NEVER alter the existing state, only return a new one
//   4) MUST NEVER call non-pure functions, like AJAX calls
import reducer from './reducers/reducer.js'; 

// Create the Redux Store, this should be a representation of the
// entire application in the form of an object.  This should never
// be mutated.  To change it's values you have to dispatch an action
// which calls a reducer and returns a new state, which is set
// to the current state.
var initalState = Map({
  user: {}, //Represents the user logged in
  encounter: {}, //Represents the selected encouter
  encounters: [], //Represents all encounters the user has
  recentEncounters: [], //Represents all the recent encounters
  arkiveApiKey: '8b45akeHxpSnDlmzvw_cEy_lwjzFITo64TMRHaQWbfg1',
  arkiveApiSpeciesName: '', // note spaces replaced by %20
  arkiveApiSpeciesId: undefined, 
  arkiveApiWidth: 320,
  arkiveApiHeight: 355,
  arkiveApiImages: false, // whether to include thumbnails
  arkiveApiText: true, // whether to include species facts / description
  errorMessage: '',
  comments: []
});
const store = createStore(reducer, initalState, applyMiddleware(thunk));

// Here we dispatch a simple action which sets the state.  To see the
// details of what this function is doing, look in the following folder:
// client/reducers/reducer.js
// In React-Redux you NEVER alter the state directly, like this:
//   store.user = {<MyNewUserObject>};
// Instead you dispatch an action which calls the reducer function
// and the reducer does the work of returning a new state
// Behind the scenes, you'll write reducers that merge new elements into
// your state, which you can see in the client/reducers files

store.dispatch(function(dispatch) {
  if (auth.isSignedIn()) {
    $.ajaxSetup({ headers: { 'x-access-token': window.localStorage.getItem('com.faunadex') } });
    $.post('/api/user/getsignedinuser')
      .retry({ times: 5, timeout: 500 })
      .done(function(data) {
        store.dispatch({ type: 'SET_STATE', state: { user: data.user } });
        enc.userEncounters(data.user.username, function(err, data) {
          if (data) {
            dispatch({ type: 'SET_STATE', state: { encounters: data.encounters } });
          } else {
            dispatch({ type: 'GET_ENCOUNTERS_FAIL' });
          }
        });
      });
  }
  enc.recentEncounters(function(err, data) {
    if (data) {
      dispatch({ type: 'SET_STATE', state: { recentEncounters: data } });
    } else {
      dispatch({ type: 'GET_ENCOUNTERS_FAIL' });
    }
  });
});

var checkAuth = function() {
  clearErrors();  
  return auth.isSignedIn();
};

var clearErrors = function() {
  store.dispatch({ type: 'CLEAR_ERRORS' });
};

// store.dispatch({
//   type: 'SET_USERNAME',
//   username: user.input.from.somewhere
// });
// Routes tell our app what to render at what urls
// In the future, we can probably set the routes to some other 
// module and include it.
//
// Provider is a special built in component which gives all child
// components access to the store.
ReactDOM.render(
  (<Provider store={store}>
    <div>
      <NavContainer />
      <Router history={hashHistory}>
        <Route component={AppContainer} path="/" />
        <Route component={SignInContainer} onEnter={clearErrors} path="/signin" />
        <Route component={SignUpContainer} onEnter={clearErrors} path="/signup" />
        <Route component={EncounterDetailsContainer} onEnter={clearErrors} path="/encounterDetails" />
        <Route component={NewEncounterContainer} onEnter={checkAuth} path="/newencounter" />
        <Route component={UserProfileContainer} onEnter={checkAuth} path="/userprofile" />
      </Router>
    </div>
  </Provider>),
  // Do our inital render on the #app element in index.html
  document.getElementById('app'));
