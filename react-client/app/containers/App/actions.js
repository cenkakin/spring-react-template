import {LOGIN, LOGIN_ERROR, LOGIN_SUCCESS, LOGOUT, LOGOUT_SUCCESS,} from './constants';

export function loggedIn() {
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR, error,
  };
}

export function loginRequested() {
  return {
    type: LOGIN,
  };
}

export function logoutRequested() {
  return {
    type: LOGOUT,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}
