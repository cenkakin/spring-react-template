/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const makeSelectLoginLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loginLoading'),
);

const makeSelectLoggedIn = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loggedIn'),
);

const makeSelectLoginError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loginError'),
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  selectGlobal,
  makeSelectLocationState,
  makeSelectLoggedIn,
  makeSelectLoginError,
  makeSelectLoginLoading,
};
