/**
 * Created by Manish on 2/25/2017.
 */
import { put, call } from 'redux-saga/effects';
import { getProductsList } from '../Api/api';
import * as types from '../constants/actionTypes';

export default function* productsSaga() {
  try {
      const products = yield call(getProductsList);
      yield [
        put({ type: types.GET_LIST_OF_PRODUCTS_SUCCESS, products})
      ];
  } catch (error) {
    yield put({ type: types.GET_LIST_OF_PRODUCTS_FAILURE, error });
  }
}
