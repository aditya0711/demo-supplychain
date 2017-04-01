/**
 * Created by adityaaggarwal on 24/2/17.
 */
import initialState from './initialState';
import * as types from '../constants/actionTypes';

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GET_LIST_OF_PRODUCTS: {
      return {
        success: null,
        products: action.products,
        message: "Get list of all products action called"
      };
    }
    case types.CREATE_PRODUCT: {
        return {
          success: null,
          products: action.products,
          message: "create a product action called"
        };
    }
    case types.GET_LIST_OF_PRODUCTS_SUCCESS:{
        return {
          success: true,
          products: action.products,
          message: "list of products received"
        };
    }
    case types.CREATE_PRODUCT_SUCCESS:{
        console.log("CREATE A PRODUCT SUCCESS REDUCER: " + JSON.stringify(action))
        return {
          success: true,
          products: action.product,
          message: "create a product success"
        };
    }
    case types.CREATE_PRODUCT_FAILURE:{
        return {
          success: false,
          products: action.products,
          message: "create a product failure"
        };
    }
    default:
      return state;
  }

}
