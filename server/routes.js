/**
 * Define API Routes
 */
const routes = require('express').Router();
const users = require('./api/v1/users');
const store = require('./api/v1/store');
const product = require('./api/v1/product');

//const manufacturer  = require('./api/v1/manufacturer');



routes.use('/api/v1/users', users);
routes.use('/api/v1/store', store);
routes.use('/api/v1/product', product);



//routes.use('/api/v1/manufacturer');

/** 
 * Serve the docs for the api
 */
const path = require('path');
routes.get('/docs', function(res, req){
  res.sendFile(path.join(__dirname + '/../doc/index.html'));
});

//Not using ECMA Script6. Sticking to the earlier version of JS for now.
// routes.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../doc/index.html'));
// });

module.exports = routes;