import React from 'react';
import {connect} from 'react-redux';
import {EncounterList, EncounterListContainer} from './EncounterList';
import {UserProfileContainer} from './UserProfile.js';

export const App = React.createClass({
  // TODO how do we get store?
  // TODO figure out on click events in React 
  render: function() {
    return (
      <div className='app'>
        Welcome to Faunadex!
        The user in the store is: {this.props.username}
        <EncounterListContainer />
        <UserProfileContainer />
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    recentEncounters: state.getIn(['recentEncounters']),
    username: state.getIn(['user', 'username']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
