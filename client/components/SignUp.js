import React from 'react';
import {connect} from 'react-redux';
import auth from '../lib/auth.js';

// the first of two things that a React-Redux component exports is 
// a standard React component which uses a bunch of props.

export const SignUp = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  signUp: function() {
    this.props.dispatchSignUp(this.refs.username.value, 
                              this.refs.password.value, 
                              this.refs.description.value,
                              this.refs.avatar.value,  
                              this.context.router);
  },

  render: function() {
    return <div className='sign-up'>
      <h2>Sign Up</h2>
      <div className='error-message'>{this.props.errorMessage}</div>
      <p>Already have an account? <a href="/#/signin">Sign in!</a></p>
      <div>Username: <input ref="username" /></div>
      <div>Password: <input type="password" ref="password" /></div>
      <p>Tell us about yourself!</p>
      <div> Description: <input type="description" ref="description" /></div>
      <p>Don't be shy! Upload a photo!</p>
      <div>Photo URL: <input type="user-photo" ref="avatar" /></div>
      <button onClick={this.signUp}>Sign Up</button>
    </div>;
  }
});

// Next, you have to write a function that returns an object which
// tells React-Redux how to map everything in the store to any
// props refered to in the above component
function mapStateToProps(state) {
  return {
    username: state.getIn(['user', 'username']),
    descr: state.getIn(['user', 'description']),
    errorMessage: state.get('errorMessage')
  };
}

// There is also a function for mapping functions to the dispatching of actions
function mapDispatchToProps(dispatch) {
  return {
    dispatchSignUp: (username, password, description, avatar, router) => {
      dispatch((dispatch) => {
        dispatch({
          type: 'SIGN_UP_ATTEMPT',
          username: username,
          password: password, 
          description: description,
          avatar: avatar,
        });
        auth.signup(username, password, description, avatar, (err, data) => {
          if (data.type === 'USER') {
            dispatch({ type: 'SET_STATE', state: { user: data.user } });
            dispatch({ type: 'CLEAR_ERRORS' });
            router.push('/');
            return;
          } else {
            var message = '';
            if (!err) { message = data.error; }
            dispatch({ type: 'SIGN_UP_FAIL', message });
          }
        });
      });
    }
  };
}
// Lastly, we export an object which tells what function to use to map
// the state to the props
export const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp);

