import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ProductsListPage from './containers/ProductsListPage';
import App from './containers/App';
import HomePage from './components/HomePage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="prodList" component={ProductsListPage} />
  </Route>
);

