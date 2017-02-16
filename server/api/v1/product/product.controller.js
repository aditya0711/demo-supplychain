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


exports.create = create;
exports.history = history;
exports.getAllProducts = getAllProducts;
exports.addComponent = addComponent;
exports.getProduct  = getProduct;

function create(req, res)  {
    const deploy = req.app.get('deploy');
    const data = req.body;
    console.log((data))

    var product = {};
    product.id = data.id;
    product.name = data.name;
    product.description = data.description;
    product.manufacturingDate = data.date;
    product.manufacturingLocation = data.location;

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
    component.pid = data.product_contract_address;

    console.log("Product ID: " + JSON.stringify(component.id) + deploy.adminName);

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

function getProduct(req, res){
    const product_id = req.params.id;

}

function history(req, res) {
    const deploy = req.app.get('deploy');
    const searchTerm = req.query.term;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getUsers(deploy.adminName, searchTerm))
        .then(function(scope) {
            util.response.status200(res, {users: scope.userList});
        })
        .catch(function(err) {
            util.response.status500(res, err);
        });
}


