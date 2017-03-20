const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const productManager = require('../productManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'ProductManager';
const contractFilename = config.contractsPath + '/component/ProductManager.sol';

describe('ProductManager tests', function () {
  this.timeout(config.timeout);

  const scope = {};

  // upload the ProductManager contract
  before(function (done) {
    rest.setScope(scope)
      .then(productManager.compileSearch())
      .then(rest.createUser(adminName, adminPassword))
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('should add a product', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
      name: 'parentName_' + uid,
      price: 1234,
    };

    // function createProduct(bytes32 id32, string id, string name, uint price) returns (ErrorCodesEnum)
    const method = 'createProduct';
    const args = {
      id: parent.id,
      id32: util.toBytes32(parent.id),
      name: parent.name,
      price: parent.price,
    };

    rest.setScope(scope)
    // add new comp
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(function (scope) {
        // returns ErrorCodesEnum
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, 'addItem should return' + ErrorCodesEnum[ErrorCodesEnum.SUCCESS]);
        return scope;
      })
      // get the state
      .then(rest.getState(contractName))
      .then(function (scope) {
        const result = scope.states[contractName];
        const components = result.components;
        assert.equal(components.length, 2, 'should have added 1 component');
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });
});