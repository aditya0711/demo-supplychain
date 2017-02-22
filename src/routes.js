import React from 'react';
import addProduct from'./AddProduct/container/addProduct';
import {Route,  IndexRoute} from 'react-router';

import AddProduct from './AddProduct';
import ProductList from './ProductsList';

export default (
    <Route path="/">
            <IndexRoute component={addProduct} />
        <Route path="/list" component={ProductList}></Route>
    </Route>
);