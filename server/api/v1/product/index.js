/**
 * Created by aditya on 3/20/17.
 */
const express = require('express');
const controller = require('./product.controller');
const router = express.Router();

router.get('/', controller.getProducts)
router.get('/:id', controller.getProductById);
router.post('/', controller.createProduct);
router.post('/link/', controller.link);

module.exports = router;
