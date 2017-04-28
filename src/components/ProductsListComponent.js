/**
 * Created by Manish on 2/24/2017.
 */
import React, { PropTypes } from 'react';
import  ProductListSuccess from '../components/ProductListSuccess';


const ProductsListComponent = ({products}) => (
  <div>
    <h2>Products</h2>
      <ProductListSuccess/>
  </div>
);

ProductsListComponent.propTypes = {
  products : PropTypes.object
};

export default ProductsListComponent;
