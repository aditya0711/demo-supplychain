/**
 * Created by adityaaggarwal on 16/2/17.
 */
'use strict'
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const should = common.should;
const assert = common.assert;
const expect = common.expect;
const _ = require('underscore');

const demoData = fsutil.yamlSafeLoadSync(config.dataFilename);
assert.isDefined(demoData, 'demo Data read failed');
assert.isDefined(demoData.store, 'demo Data read failed');
var ms = require('../demoapp')(config.contractsPath);

describe('Product Manager tests', function() {
    this.timeout(90 * 1000);

    const scope = {};
    const adminName = util.uid('Admin_8113_668167688');
    const adminPassword = '1234';
    const contractName = 'ProductManager';
    const contractFilename = config.contractsPath + '/product/ProductManager.sol';

    const products = demoData.products;
    const components = demoData.components;
    console.log("***PRODUCTS***" + products);
    const E = ms.getEnums().ErrorCodesEnum;

    //upload the product manager contract
    before(function(done){
        rest.setScope(scope)
            .then(rest.createUser(adminName, adminPassword))
            .then(rest.getContractString(contractName, contractFilename))
            .then(rest.uploadContract(adminName, adminPassword, contractName))
            .then(function (scope) {
                done();
            })
            .catch(done);
    });
    const method = "addProduct";

    //add a new product
    it('should create the product manager and add products', function(done) {
        rest.setScope(scope)
            .then(rest.callMethod(adminName, contractName, method, ms.createProductArgs(products[0])))
            .then(function (scope) {
                //returns ErrorCodesEnum
                const result = scope.contracts[contractName].calls[method];
                assert.equal(result, E.SUCCESS, 'addProduct should return' + E[E.SUCCESS]);
                return scope;
            })
            .then(function (scope) {
                done();
            }).catch(done);
    });
    //add same product, expected result: id should be different
    it('should not add a duplicate product', function(done) {
            rest.setScope(scope)
                .then(rest.callMethod(adminName, contractName, method, ms.createProductArgs(products[0])))
                .then(function (scope) {
                    //returns ErrorCodesEnum
                    const result = scope.contracts[contractName].calls[method];
                    assert.equal(result, E.PRODUCT_EXISTS, 'addProduct should return' + E[E.PRODUCT_EXISTS]);
                    return scope;
                })
                .then(function (scope) {
                    done();
                }).catch(done);
        });
    //add more products
    it('should add more products', function(done) {
        rest.setScope(scope)
            .then(rest.callMethod(adminName, contractName, method, ms.createProductArgs(products[1])))
            .then(function (scope) {
                //returns ErrorCodesEnum
                const result = scope.contracts[contractName].calls[method];
                assert.equal(result, E.SUCCESS, 'addProduct should return' + E[E.SUCCESS]);
                return scope;
            })
            .then(function (scope) {
                done();
            }).catch(done);
    });
    //get Product Address
    it('should check the state of a product', function(done) {
        rest.setScope(scope)
            .then(rest.getState(contractName))
            .then(function(scope){
                const products = scope.states[contractName].products;
                return rest.getState('Product', products[1])(scope);
            })
            .then(function(scope) {
                const result = scope.states['Product'];
                const product = products[0];
                assert.equal(result.name, product.name, 'name');
                assert.equal(result.description, product.description, 'price');
                assert.equal(result.manufactuirngLocation, product.manufactuirngLocation, 'desc');
                assert.equal(result.manufactuirngDate, product.manufactuirngDate, 'imageUrl');
                assert.equal(result.id, product.id, 'id');
                return scope;
            }).then(function (scope) {
                done();
            }).catch(done);
    });


    //add a component to an existing product
     it('should add a component to an existing product', function(done){
        var methodName = 'addComponent';
        //var product_address = "";

        rest.setScope(scope)
            //get an existing products from state
            .then(rest.getState(contractName))
            .then(function(scope){
                //console.log("helloo");
                const products = scope.states[contractName].products;
                //console.log("PRODDS: "  + products);
                components[0].productID = products[1];
                //console.log("COMPONENT: " + JSON.stringify(components[0]));
                return rest.getState('Product', products[1])(scope);
            })
            .then(rest.callMethod(adminName, contractName, methodName, ms.createComponentArgs(components[0])))
            .then(function(scope){
                const result = scope.contracts[contractName].calls[methodName]
                assert.equal(result, E.SUCCESS, 'addComponent should return ' + E[E.SUCCESS]);
                console.log("SCOPE0: " + JSON.stringify(scope))
                return scope;
            })
            //add the SAME Component to product[1] again. Should give error
            .then(rest.callMethod(adminName, contractName, methodName, ms.createComponentArgs(components[0])))
            .then(function(scope){
                console.log("SCOPE1: " + JSON.stringify(scope))
                const result = scope.contracts[contractName].calls[methodName]
                assert.equal(result, E.COMPONENT_EXISTS, 'addComponent should return ' + E[E.COMPONENT_EXISTS]);
                return scope;
            })
            //add another component
            .then(rest.callMethod(adminName, contractName, methodName, ms.createComponentArgs(components[1])))
            .then(function(scope){
                console.log("SCOPE1: " + JSON.stringify(scope))
                const result = scope.contracts[contractName].calls[methodName]
                assert.equal(result, E.SUCCESS, 'addComponent should return ' + E[E.SUCCESS]);
                return scope;
            })
            .then(function(scope){
                done();
            })
            .catch(done);
    })

    // it('Should get the Product details given one of its componenets', function(done){
    //     var methodName = 'getAddressById';
    //     var arg = {
    //         _id : components[0].id
    //     }
    //     var componentAddress;
    //     rest.setScope(scope)
    //         .then(rest.callMethod(adminName, contractName, 'getAddressById',  {_id : components[0].id}))
    //         .then(function(scope){
    //             const result = scope.contracts[contractName].calls['getAddressById']
    //             componentAddress = result;
    //             return scope;
    //         })
    //         .then(rest.query('Product?productType=eq.PRODUCT'))
    //         .then(function(scope){
    //             const products = scope.query;
    //             // _.each(products, function(product, index, products){
    //             //     for(var i = 0; i < product[0].componentList.length; i++){
    //             //         console.log("product: " + product[0].componentList[i])
    //             //         if(product[0].componentList[i] === componentAddress){
    //             //             console.log("RESULT: "  + true);
    //             //         }
    //             //     }
    //             // })
    //
    //         })
    //         .then(function(scope){
    //             done();
    //         })
    //         .catch(done)
    //
    // });


});