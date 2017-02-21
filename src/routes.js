/**
 * Created by Manish on 2/18/2017.
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import NavPage from './NavPage';
import AddProduct from './addProduct/AddProduct';
import ProdList from './productList/ProdList';

// Map components to different routes.
// The parent component wraps other components and thus serves as  the entrance to
// other React components.
// IndexRoute maps HomePage component to the default route
export default (
    <Route path="/" component={NavPage}>
        <IndexRoute component={AddProduct} />
        <Route path="/ProdList" component={ProdList}></Route>
        <Route path="/AddProduct" component={AddProduct}></Route>
    </Route>
);
