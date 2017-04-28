/**
 * Created by Manish on 2/24/2017.
 */
import * as types from '../constants/actionTypes';

export const getProductsList = () => ({
  type: types.GET_LIST_OF_PRODUCTS
});

export const selectProduct = (product) => ({
    type: types.SELECTED_PRODUCT, product
});