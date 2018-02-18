/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT } from './constants';

const isAuthenticated = () => !!localStorage.getItem('identity');

// The initial state of the App
const initialState = fromJS({
  loggedIn: isAuthenticated(),
  loading: false,
  loginLoading: false,
  loginError: null,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return state
        .set('loginLoading', false)
        .set('loggedIn', true);
    case LOGOUT:
      return state
        .set('loggedIn', false);
    case LOGIN:
      return state
        .set('loginLoading', true)
        .set('loginError', null);
    case LOGIN_ERROR:
      return state
        .set('loginLoading', false)
        .set('loginError', action.error);
    default:
      return state;
  }
}

export default appReducer;
