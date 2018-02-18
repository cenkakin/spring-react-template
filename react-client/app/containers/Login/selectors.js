import { createSelector } from 'reselect';

const selectLogin = (state) => state.get('login');

const makeSelectLoginData = () => createSelector(
  selectLogin,
  (loginState) => loginState.get('loginData'),
);

export {
  selectLogin,
  makeSelectLoginData,
};
