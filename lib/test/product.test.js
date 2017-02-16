/**
 * Created by adityaaggarwal on 14/2/17.
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
console.log(JSON.stringify(demoData, null, 2));

/* For the product to be uploaded, the following steps need to be followed (Requirements)
1. the ProductManager contract should be deployed
2. Admin user should be there
3. data entered for the contract should be valid
4.




 */


describe('Product Tests', function(){
    "use strict";
    this.timeout(90*1000);

    const scope = {};
    const adminName = util.uid('Admin');
    const adminPassword = '1234';
    const contractName = 'Product';
    const contractFileName = config.contractsPath + '/product/Product';

    it('Should read the product content', function(done){

        const product = demoData.product[0];
        const PRODUCT_ID = '958929f8-f2ac-11e6-bc64-92361f002671';
        const args = {
            _id : PRODUCT_ID,
            _name : product.name,
            _description : product.description,
            _manufacturingDate : product.manufacturingDate,
            _manufacturingLocation : product.manufacturingLocation
        }

        var product_contract_address;

        const method = 'addProduct';

        rest.setScope(scope)
            .then(rest.createUser(adminName, adminPassword))
            .then(rest.getContractString(contractName, contractFileName))
            .then(rest.uploadContract(adminName, adminPassword, contractName, args))
            // create a new product
            .then(rest.callMethod(adminName, contractName, 'addProduct'))
            .then(function(scope){
                const result = scope.contracts[contractName].calls['addProduct'];
                const expected = product.id; //FIXME
                assert.equal(result, expected, 'Product should be uuid'); //FIXME
                return scope;
            })
            //add a component to an existing product
            .then(rest.callMethod(adminName, contractName, 'addComponent'))
            .then(function(scope){
                const result = scope.contracts[contractName].calls[method];


            })
    })
})