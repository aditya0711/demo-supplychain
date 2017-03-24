/**
 * Created by aditya on 3/20/17.
 */
'use strict';
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const path = require('path');
const libPath = './lib';
const ms = require(`${path.join(process.cwd(), libPath)}/demoapp`)(config.contractsPath); // FIXME move to package

module.exports = {
    createProduct : createProduct,
    addSubProduct : addSubProduct,
    getProducts : getProducts,
    getProductById : getProductById,
};
const contractName = 'ProductManager';

function createProduct(req, res){
    const deploy = req.app.get('deploy');
    const body = req.body;
    const method = 'createProduct';
    var products = [];

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.createProduct(deploy.adminName, body.id, body.name, body.price))
        .then(function(scope){
            var result = scope.contracts[contractName].calls[method];
            util.response.status200(res, result);
        })
        .catch(function(err){
            console.log(err);
            util.response.status500(res, err);
        })

}

function addSubProduct(req, res){
    const deploy = req.app.get('deploy');
    const body = req.body;
    const method = 'addSubComponent';

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.addSubProduct(deploy.adminName, body.parentId, body.childId, body.quantity))
        .then(function(scope){
            var result = scope.contracts[contractName].calls[method];
            util.response.status200(res, result);
        })
        .catch(function(err){
            util.response.status500(res, err);
        })
}
/**
 * @api {get} / Request list of all products
 * @apiName GetProducts
 * @apiGroup Product
 *
 *
 * @apiSuccess {Array} List of all products.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "success": true,
 *      "data": {
 *          "products": [
 *          {
 *              "address": "a3a145e406746e1f6f5d11ea7dc89d09d1b9e177",
 *              "_id": "1addd190-10b1-11e7-beb0-c7f494f6a7a2",
 *              "_name": "Robert",
 *              "children": [
 *                              {
 *                              "id32": "0000000000000000000000000000000000000000000000000000000000000000",
 *                              "adrs": "0000000000000000000000000000000000000000",
 *                              "quantity": "0"
 *                              }
 *                          ],
 *              "_price": 122,
 *              "_id32": "643139302d313062312d313165372d626562302d633766343934663661376132"
 *          }
 *      ]
 *     }
 *   }
 * @apiError error Product lookup failed.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "error": "Product lookup failed."
 *     }
 */
function getProducts(req, res){
    const deploy = req.app.get('deploy');
    const body = req.body;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getProductsQuery(deploy.adminName))
        .then(function(scope){
            var result = scope.query.slice(-1)[0];
            console.log("RESULT: " + JSON.stringify(scope))
            util.response.status200(res, {products: result});
        })
        .catch(function(err){
            util.response.status500(res, err);
        })
}

/**
 * @api {get} / Request product details by ID
 * @apiName GetProduct
 * @apiGroup Product
 *
 *
 * @apiSuccess {Object} Product Details
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "success": true,
 *      "data": {
 *          "product": [
 *          {
 *              "address": "a3a145e406746e1f6f5d11ea7dc89d09d1b9e177",
 *              "_id": "1addd190-10b1-11e7-beb0-c7f494f6a7a2",
 *              "_name": "Robert",
 *              "children": [
 *                              {
 *                              "id32": "0000000000000000000000000000000000000000000000000000000000000000",
 *                              "adrs": "0000000000000000000000000000000000000000",
 *                              "quantity": "0"
 *                              }
 *                          ],
 *              "_price": 122,
 *              "_id32": "643139302d313062312d313165372d626562302d633766343934663661376132"
 *          }
 *      ]
 *     }
 *   }
 * @apiError error Product lookup failed.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "error": "Product lookup failed."
 *     }
 */
function getProductById(req, res){
    const deploy = req.app.get('deploy');
    const body = req.body;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getProductsQuery(deploy.adminName, req.params.id))
        .then(function(scope){
            var result = scope.query.slice(-1)[0];

            util.response.status200(res, {product: result});
        })
        .catch(function(err){
            util.response.status500(res, err);
        })
}