/**
 * Created by adityaaggarwal on 24/2/17.
 */
import { put, call } from 'redux-saga/effects';
import { createProduct } from '../Api/api';
import * as types from '../constants/actionTypes';

export default  function* createProductSagas({products}){
  try {
    const product = yield call(createProduct, products);
    console.log("SAGAS CONTROL: " + JSON.stringify(product))

    yield [
      put({ type: types.CREATE_PRODUCT_SUCCESS, product })
    ];
  } catch (error) {
    console.log("SAGA ERROR: " + error.message)
    yield put({ type: types.CREATE_PRODUCT_FAILURE, error });
  }
}
