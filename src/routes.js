import React from 'react';
import addProduct from'./AddProduct/container/addProduct';
import {Route,  IndexRoute} from 'react-router';

export default (
    <Route path="/">
            <IndexRoute component={addProduct} />
    </Route>
);