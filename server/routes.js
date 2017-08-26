/**
 * Define API Routes
 */
const routes = require('express').Router();
const users = require('./api/v1/users');
const store = require('./api/v1/store');
const product = require('./api/v1/products');

routes.use('/api/v1/users', users);
routes.use('/api/v1/store', store);
routes.use('/api/v1/products', product);
const products = require('./api/v1/products');

routes.use('/api/v1/users', users);
routes.use('/api/v1/store', store);
routes.use('/api/v1/products', products);

/**
 * Serve the docs for the api
 */
const path = require('path');
routes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../doc/index.html'));
});

module.exports = routes;