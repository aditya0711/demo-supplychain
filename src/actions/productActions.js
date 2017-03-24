/**
 * Created by adityaaggarwal on 24/2/17.
 */
import * as types from '../constants/actionTypes';

export const selectListProducts = () => ({
  type: types.GET_LIST_OF_PRODUCTS
});

export const createProductAction = (products) => ({
  type: types.CREATE_PRODUCT,
  products
});
