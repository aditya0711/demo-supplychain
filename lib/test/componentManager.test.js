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

const componentManager = require('../componentManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'ComponentManager';
const contractFilename = config.contractsPath + '/component/ComponentManager.sol';

describe('ComponentManager tests', function() {
  this.timeout(config.timeout);

  const scope = {};

  // upload the component-manager contract
  before(function(done) {
    rest.setScope(scope)
      .then(componentManager.compileSearch())
      .then(rest.createUser(adminName, adminPassword))
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('should add a component', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };

    // function createComponent(bytes32 id32, string id, string name) returns (ErrorCodesEnum)
    const method = 'createComponent';
    const args = {
      id: parent.id,
      id32: util.toBytes32(parent.id),
      name: parent.name,
    };

    rest.setScope(scope)
      // add new comp
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(function(scope) {
        // returns ErrorCodesEnum
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, 'addItem should retuen' + ErrorCodesEnum[ErrorCodesEnum.SUCCESS]);
        return scope;
      })
      // get the state
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const components = result.components;
        assert.equal(components.length, 2, 'should have added 1 component');
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('check exists', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };

    rest.setScope(scope)
      .then(existsTest(adminName, parent.id, false))
      .then(createComponentTest(adminName, parent.id, parent.name, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, parent.id, true))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add duplicate name', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };

    rest.setScope(scope)
      .then(createComponentTest(adminName, parent.id, parent.name, ErrorCodesEnum.SUCCESS))
      .then(createComponentTest(adminName, parent.id, parent.name, ErrorCodesEnum.EXISTS))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it.only('add sub component', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 12,
    };

    rest.setScope(scope)
      .then(createComponentTest(adminName, parent.id, parent.name, ErrorCodesEnum.SUCCESS))
      .then(createComponentTest(adminName, child.id, child.name, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, parent.id, child.id, child.quantity, ErrorCodesEnum.SUCCESS))
      .then(function(scope) {
        done();
      }).catch(done);
  });

});

function createComponentTest(adminName, id, name, expected) {
  return function(scope) {
    rest.verbose('createComponent', expected);
    const method = 'createComponent';

    return rest.setScope(scope)
      .then(componentManager.createComponent(adminName, id, name))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, expected, `${method} should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}

function existsTest(adminName, id, expected) {
  return function(scope) {
    rest.verbose('existsTest', expected);
    const method = 'exists';

    return rest.setScope(scope)
      .then(componentManager.exists(adminName, id))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls[method] == 'true';
        assert.equal(result, expected, 'component exist');
        return scope;
      });
  }
}

function addSubComponentTest(adminName, parentId, childId, quantity, expected) {
  return function(scope) {
    rest.verbose('addSubComponentTest', expected);
    const method = 'addSubComponent';

    return rest.setScope(scope)
      .then(componentManager.addSubComponent(adminName, parentId, childId, quantity))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, expected, `${method} should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}
