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

function getProducts(req, res){
    const deploy = req.app.get('deploy');
    const body = req.body;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getProductById(deploy.adminName))
        .then(function(scope){
            var result = scope.states['Product'];

            util.response.status200(res, result);
        })
        .catch(function(err){
            util.response.status500(res, err);
        })
}
function getProductById(req, res){}