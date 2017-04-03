/**
 * Created by adityaaggarwal on 31/3/17.
 */
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const should = common.should;
const assert = common.assert;
const expect = common.expect;
const Promise = common.Promise;

// ---------------------------------------------------
//   deploy the projects contracts
// ---------------------------------------------------
const deploy = fsutil.yamlSafeLoadSync(config.deployFilename, config.apiDebug);
assert.isDefined(deploy['AdminInterface'].address);

var ms = require('./demoapp')(config.contractsPath);
describe('Demo App - Business Functions - Users', function() {
    this.timeout(config.timeout);

    const scope = {};
    const adminName = util.uid('Admin');
    const adminPassword = '1234';
    const E = ms.getEnums().ErrorCodesEnum;

    before(function (done) {
        rest.setScope(scope)
            .then(rest.createUser(adminName, adminPassword))
            .then(ms.getAdminInterface(deploy.AdminInterface.address))
            .then(ms.setAdmin(adminName, adminPassword, deploy.AdminInterface.address))
            .then(function (scope) {
                done();
            }).catch(done);
    });

    it('Should create a product', function(done){
        var product = {
            id : util.uid('ProductId'),
            name  : util.uid('ProductName'),
            price : 100
        };
        ms.setScope(scope)
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Product Successfully added");
                done();
            })
            .catch(done);

    })
    it('should check for creating a duplicate product', function(done){

        var product = {
            id : util.uid('ProductId'),
            name  : util.uid('ProductName'),
            price : 100
        };

        ms.setScope(scope)
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Product Successfully added");
                return scope;
            })
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .catch(function(err){
                //console.log("ERROR thrown: " + err.message);
                assert.equal(err.message, 'Product exists: '+ product.id)
                done();
            })

    })

    it('Should Link 2 Products', function(done){

        var product = {
            id : util.uid('ProductId'),
            name  : util.uid('ProductName'),
            price : 100
        };
        var childProduct = {
            id : util.uid('childId'),
            name  : util.uid('childName'),
            price : 711
        }
        var quantity = 1;

        ms.setScope(scope)
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(ms.createProduct(adminName, childProduct.id, childProduct.name, childProduct.price))
            .then(ms.link(adminName, product.id, childProduct.id, quantity))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Products Successfully linked");
                done();
            })
    })

    it('should link 2 products fail cases', function(done){

        var product = {
            id : util.uid('ProductId'),
            name  : util.uid('ProductName'),
            price : 100
        };
        var childProduct = {
            id : util.uid('childId'),
            name  : util.uid('childName'),
            price : 711
        }
        var quantity = 1;

        ms.setScope(scope)
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(ms.createProduct(adminName, childProduct.id, childProduct.name, childProduct.price))
            //add a subproduct
            .then(ms.link(adminName, product.id, childProduct.id, quantity))
            //add the same child again - Error thrown
            .then(ms.link(adminName, product.id, childProduct.id, quantity))
            .catch(function(err){
                assert.equal(err.message, 'Sub Product Exists', 'Sub Product Already Exists')
                return scope;
            })
            //add a recursive child
            .then(ms.link(adminName, product.id, product.id, quantity))
            .catch(function(err){
                assert.equal(err.message, 'Adding recursive child', 'Adding recursive Child')
                return scope;
            })
            //add to a non existing product
            .then(ms.link(adminName, product.id + 1, product.id, quantity))
            .catch(function(err){
                assert.equal(err.message, 'Product not found', 'Product Not Found')
                done();
            })
    })
});