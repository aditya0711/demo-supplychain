'use strict';
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const path = require('path');
const libPath = './dapp';
const dapp = require(`${path.join(process.cwd(), libPath)}/dapp`)(config.contractsPath); // FIXME move to package

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
 *       "success": true,
 *       "data": [
 *         {
 *          "id32": "00000000000000003434353631343838",
 *          "name": "test 2 44561488",
 *          "price": "2",
 *         }
 *       ]
 *     }
 * @apiError error Product lookup failed.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "success": false,
 *       "error": "Product lookup failed."
 *     }
 */


exports.getProducts = (req, res) => {
    const deploy = req.app.get('deploy');
    dapp.setScope()
        .then(dapp.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(dapp.productManager.getProducts())
        .then(scope => {
            const products = scope.result;
            util.response.status200(res, products);
        })
        .catch(err => {
            util.response.status500(res, err);
        });
}

/**
 * @api {post} / Create/Upload a Product
 * @apiName CreateProduct
 * @apiGroup Product
 *
 * @apiParam {String} id ID of the Product.
 * @apiParam {String} name Name of the Product.
 * @apiParam {int} price Price of the Product.
 *
 *
 * @apiSuccess {int} 1 for Successful Creation
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": "1"
 *     }
 * @apiError .
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Error
 *     {
 *       "success": false,
 *       "error": "Error: Product exists: 1addd190-10b1-11e7-beb0-d7f494123a7a2"
 *     }
 */

exports.createProduct = (req, res) => {
    const deploy = req.app.get('deploy');
    const body = req.body;
    dapp.setScope()
        .then(dapp.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(dapp.productManager.createProduct(deploy.adminName, body.id, body.name, body.price))
        .then(dapp.productManager.getProduct(body.id))
        .then(scope => {
            const product = scope.result;
            util.response.status200(res, product);
        })
        .catch(err => {
            util.response.status500(res, err);
        });
}
