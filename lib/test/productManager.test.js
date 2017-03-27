const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;

const productManager = require('../productManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'ProductManager';

describe('ProductManager tests', function () {
  this.timeout(config.timeout);

  const scope = {};

  // upload the ProductManager contract
  before(function (done) {
    rest.setScope(scope)
    // create admin
      .then(rest.createUser(adminName, adminPassword))
      // upload ComponentManager
      .then(productManager.uploadContract(adminName, adminPassword))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('should create a product', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    rest.setScope(scope)
    // create component
      .then(productManager.createProduct(adminName, parent.id, parent.name, parent.price))
      // test creation - returns ErrorCodesEnum
      .then(function (scope) {
        const method = 'createProduct';
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, `${method} should return ${ErrorCodesEnum[ErrorCodesEnum.SUCCESS]}`);
        return scope;
      })
      // get the state
      .then(rest.getState(contractName))
      .then(function (scope) {
        const result = scope.states[contractName];
        const components = result['components'];
        assert.equal(components.length, 2, 'should have added 1 component');
        return scope;
      })
      .then(rest.waitQuery(`Product?_id=eq.${parent.id}`, 1, 12*60*1000))
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
