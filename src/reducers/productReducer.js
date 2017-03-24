/**
 * Created by adityaaggarwal on 24/2/17.
 */
import initialState from './initialState';
import * as types from '../constants/actionTypes';

export default function (state = initialState.products, action) {
  switch (action.type) {
    case types.GET_LIST_OF_PRODUCTS: {
      return [...state, action.products];
    }
    case types.CREATE_PRODUCT: {
      return [...state, action.products];
    }
    case types.GET_LIST_OF_PRODUCTS_SUCCESS:{
      return[...state, action.products];
    }
    default:
      return state;
  }

}
