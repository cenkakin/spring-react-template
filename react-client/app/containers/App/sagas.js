import { call, put, takeLatest } from 'redux-saga/effects';
import { LOGOUT } from 'containers/App/constants';
import { logoutSuccess } from 'containers/App/actions';

import { doRequest } from 'utils/request';

export function* doLogout() {
  yield call(() => localStorage.removeItem('identity'));
  yield call(doRequest.post, 'api/logout');
  yield put(logoutSuccess());
}

export function* logout() {
  yield takeLatest(LOGOUT, doLogout);
}

// Bootstrap sagas
export default [
  logout,
];
