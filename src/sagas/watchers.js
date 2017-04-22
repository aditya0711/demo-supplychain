import { takeLatest } from 'redux-saga';
import productsSaga from './productsSaga';
import * as types from '../constants/actionTypes';


export default function* watchProductSagas() {
    yield* takeLatest(types.GET_LIST_OF_PRODUCTS, productsSaga)
};
