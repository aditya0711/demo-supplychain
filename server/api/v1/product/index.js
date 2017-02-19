/**
 * Created by aditya on 2/7/17.
 */
const express = require('express');
const controller = require('./product.controller');
const router = express.Router();

//list of all products
router.get('/', controller.getAllProducts);

//get product by ID - refers to the unique product ID and not the address.
router.get('/:id', controller.getProduct);

//info needed: timestamp, product name, components(which is a list of contract address of other producst), status
router.post('/addProduct', controller.addProduct);

//addComponent to a product
router.post('/addComponent/:productID', controller.addComponent)

//get product history by product ID- unique ID
//router.get('/history/:id', controller.history);


module.exports = router;
