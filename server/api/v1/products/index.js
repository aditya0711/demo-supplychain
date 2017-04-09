const express = require('express');
const controller = require('./products.controller');
const router = express.Router();

router.get('/', controller.getProducts);

module.exports = router;
