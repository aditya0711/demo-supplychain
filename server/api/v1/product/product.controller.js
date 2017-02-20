/**
 * Created by aditya on 2/7/17.
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
var uuid = require('node-uuid');

exports.addProduct = addProduct;
//exports.history = history;
exports.getAllProducts = getAllProducts;
exports.addComponent = addComponent;
exports.getProduct  = getProduct;



function addProduct(req, res)  {
    const deploy = req.app.get('deploy');
    const data = req.body;
    console.log((data))

    var product = {};
    product.id                      = data.id;
    product.name                    = data.name;
    product.description             = data.description;
    product.manufacturingDate       = data.date;
    product.manufacturingLocation   = data.location;

    console.log("Product ID: " + JSON.stringify(product.id) + deploy.adminName);

        ms.setScope()
            .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
            .then(ms.addProduct(deploy.adminName, product))
            .then(function (scope) {
                console.log("Inside add product: "+ JSON.stringify(scope))

                util.response.status200(res, {product: scope});
            })
            .catch(function (err) {
                console.log("error: " +  err)
                //util.response.status500(res, err);
            });
}

function addComponent(req, res)  {
    const deploy = req.app.get('deploy');
    const data = req.body;
    console.log((data))

    var component = {};
    component.id = uuid.v1();
    component.name = data.name;
    component.description = data.description;
    component.manufacturingDate = data.date;
    component.manufacturingLocation = data.location;
    component.pid = req.params.productID;

    console.log("Product ID: " + JSON.stringify(component.id) + deploy.adminName+"product id"+component.pid);

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.addComponent(deploy.adminName, component))
        .then(function (scope) {
            console.log("Inside add product: "+ JSON.stringify(scope))

            util.response.status200(res, {component: scope});
        })
        .catch(function (err) {
            console.log("error: " +  err)
            //util.response.status500(res, err);
        });
}
/**
 * @api {get} /product/ Get all products in the system.
 * @apiName GetProducts
 * @apiGroup Product
 *
 *
 * @apiSuccess {Object[]} List of all products.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *           products: [],
 *        }
 *     }
 * @apiError Products not found in the system.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": "Products Not Found"
 *     }
 */
function getAllProducts(req, res) {
    const deploy = req.app.get('deploy');

    console.log("DEPLOY OBJ: " + deploy );

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getAllProducts(deploy.adminName))
        .then(function(scope){
            util.response.status200(res, {products: scope});
        })    .catch(function(err)  {
        util.response.status500(res, err);
    });
}
/**
 * @api {get} /product/:id Get a Product in the system.
 * @apiName GetProduct by productID (UniqueID)
 * @apiGroup Product
 *
 *
 * @apiSuccess {Object[]} Object of product.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *           product: {
 *              name: "",
 *              description: "",
 *              manufacturingLocation: "",
 *              manufacturingDate: "",
 *              componentList: [],
 *              productType: {}}
 *        }
 *     }
 * @apiError Products not found in the system.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "success": false,
 *       "error": "Product Not Found"
 *     }
 */
function getProduct(req, res){
    const product_id = req.params.id;
    const deploy = req.app.get('deploy');

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getProductState(deploy.adminName, product_id))
        .then(function(scope){
            util.response.status200(res, {product: scope.product[product_id]});
            //res.json(scope.states['Products'])
        })
        .catch(function(err){
            console.log("asasdasdasd : " + err)
        })

}
//#FIXME NOT YET IMPLEMENTED
// function history(req, res) {
//     const deploy = req.app.get('deploy');
//     const searchTerm = req.query.term;
//
//     ms.setScope()
//         .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
//         .then(ms.getUsers(deploy.adminName, searchTerm))
//         .then(function(scope) {
//             util.response.status200(res, {users: scope.userList});
//         })
//         .catch(function(err) {
//             util.response.status500(res, err);
//         });
// }


