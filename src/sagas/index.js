import { fork } from 'redux-saga/effects';
import watchProductSagas from './watchers';

export default function* startForman() {
  yield fork(watchProductSagas);
}
