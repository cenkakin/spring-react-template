import { fromJS } from 'immutable';

import { CHANGE_LOGIN_DATA } from './constants';

// The initial state of the Login
const initialState = fromJS({
  loginData: {},
});

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOGIN_DATA:
      return state
        .set('loginData', action.loginData);
    default:
      return state;
  }
}

export default loginReducer;
