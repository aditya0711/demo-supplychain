/**
 * Created by adityaaggarwal on 16/2/17.
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

const demoData = fsutil.yamlSafeLoadSync(config.dataFilename);
assert.isDefined(demoData, 'demo Data read failed');
assert.isDefined(demoData.store, 'demo Data read failed');
var ms = require('../demoapp')(config.contractsPath);

describe('Product Manager tests', function() {
    this.timeout(90 * 1000);

    const scope = {};
    const adminName = util.uid('Admin');
    const adminPassword = '1234';
    const contractName = 'ProductManager';
    const contractFilename = config.contractsPath + '/product/ProductManager.sol';

    const products = demoData.products;
    const E = ms.getEnums().ErrorCodesEnum;

    //upload the product manager contract
    before(function(done){
        "use strict";
        rest.setScope(scope)
            .then(rest.createUser(adminName, adminPassword))
            .then(rest.getContractString(contractName, contractFilename))
            .then(rest.uploadContract(adminName, adminPassword, contractName))
            .then(function (scope) {
                done();
            })
            .catch(done);
    });

    it('should create the product manager and add products', function(done){

        const method = "addProduct";

        rest.setScope(scope)
            //add a new product
            .then(rest.callMethod(adminName, contractName, method, ms.createProductArgs(products[0])))
            .then(function(scope){
                //returns ErrorCodesEnum
                const result = scope.contracts[contractName].calls[method];
                assert.equal(result, E.SUCCESS, 'addProduct should return' + E[E.SUCCESS]);
                return scope;
            })
            //add same product, expected result: id should be different
            //.then(rest.callMethod())
    })
});