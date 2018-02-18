import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOGIN } from 'containers/App/constants';
import { loggedIn, loginError } from 'containers/App/actions';

import { doRequest } from 'utils/request';
import { makeSelectLoginData } from 'containers/Login/selectors';
import messages from './messages';

export function* loginRequest() {
  const loginData = yield select(makeSelectLoginData());
  const res = yield call(doRequest.post, 'api/login', loginData);
  if (res.ok) {
    yield call(() => localStorage.setItem('identity', JSON.stringify(res.data.identity)));
    yield put(loggedIn());
  } else {
    yield put(loginError(res.status === 401 ? messages.wrongCredentials : res.errorMessageCode));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* login() {
  yield takeLatest(LOGIN, loginRequest);
}

// Bootstrap sagas
export default [
  login,
];
