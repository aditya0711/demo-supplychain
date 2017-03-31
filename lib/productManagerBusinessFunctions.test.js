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
            .then(function (scope) {
                done();
            }).catch(done);
    });
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
    it('should create a product', function(done){
        ms.setScope()
            .then(ms.setAdmin(adminName, adminPassword, deploy.AdminInterface.address))
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Product Successfully added");
                return scope;
            })
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(function(scope){
                const result = scope.result;
                //assert.equal()
                return scope;
                done();
            });
    })

    it('should link a product as subComponent', function(done){
        ms.setScope()
            .then(ms.setAdmin(adminName, adminPassword, deploy.AdminInterface.address))
            .then(ms.createProduct(adminName, product.id, product.name, product.price))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Product Successfully added");
                return scope;
            })
            .then(ms.createProduct(adminName, childProduct.id, childProduct.name, childProduct.price))
            .then(function(scope){
                const result = scope.result;
                assert.equal(result, E.SUCCESS, "Child Successfully added");
                return scope;
            })
            .then(ms.link(adminName, product.id, childProduct.id, quantity))
            .then(function(scope){
                console.log("RESULT--------------------------------------->" + JSON.stringify(scope));
                return scope;
            })
            .then(ms.link(adminName, product.id, childProduct.id, quantity))
            .then(function(scope){
                console.log("RESULT--------------------------------------->" + JSON.stringify(scope));
                return scope;
                done();
            })
    })
});