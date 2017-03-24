/**
 * Created by adityaaggarwal on 2/3/17.
 */
import { takeLatest } from 'redux-saga';
import createProductSagas  from './createProductSagas';
import * as types from '../constants/actionTypes';

export default function* watchCreateProduct() {
  yield* takeLatest(types.CREATE_PRODUCT, createProductSagas);
};
