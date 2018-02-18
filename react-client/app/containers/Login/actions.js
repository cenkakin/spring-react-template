import { CHANGE_LOGIN_DATA } from './constants';

export function changeLoginData(loginData) {
  return {
    type: CHANGE_LOGIN_DATA,
    loginData,
  };
}
