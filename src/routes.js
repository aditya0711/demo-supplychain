import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CreateProductPage from './containers/CreateProductPage';
import App from './containers/App';
import HomePage from './components/HomePage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="createProduct" component={CreateProductPage} />
  </Route>
);

