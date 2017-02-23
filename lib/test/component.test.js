const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const should = common.should;
const assert = common.assert;
const expect = common.expect;

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;

describe('Component', function() {
  this.timeout(config.timeout);

  const scope = {};
  const adminName = util.uid('Admin');
  const adminPassword = '1234';
  const contractName = 'Component';
  const contractFilename = config.contractsPath + '/component/Component.sol';

  before(function(done) {
    rest.setScope(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('upload a contract with constructor args', function(done) {
    const id = util.uid('ID');
    const name = util.uid('name');

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, id, name))
      .then(rest.getState(contractName))
      .then(function(scope) {
        console.log('##############################', JSON.stringify(scope, null, 2));
        const result = scope.states[contractName];
        console.log('##############################', result);
        const id32Fixed = util.fixBytes(result._id32);

        assert.equal(result._id, id, 'id');
        assert.equal(id32Fixed, util.toBytes32(id), 'id32');
        assert.equal(result._name, name, 'name');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add component', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 123,
    };

    // function addComponent(bytes32 id32, string id, uint quantity) {
    const method = 'addComponent';
    const args = {
      id32: util.toBytes32(child.id),
      id: child.id,
      quantity: child.quantity,
    };

    // call add() and test if it worked
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName].children[1];
        const id32Fixed = util.fixBytes(result.id32);

        assert.equal(result.id, child.id, 'id');
        assert.equal(id32Fixed, util.toBytes32(result.id), 'id32');
        assert.equal(result.quantity, child.quantity, 'quantity');

        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('check child exists', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 123,
    };

    // call exists() before and after add()
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(exists(adminName, child.id))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['exists'] == 'true';
        assert.equal(result, false, 'child should not exist');
        return scope;
      })
      .then(addComponent(adminName, child.id, child.quantity))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['addComponent'];
        assert.equal(result, ErrorCodesEnum.SUCCESS, 'addComponent should return ' + ErrorCodesEnum['SUCCESS']);
        return scope;
      })
      .then(exists(adminName, child.id))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['exists'] == 'true'
        assert.equal(result, true, 'child should exist');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });


  function createComponent(adminName, adminPassword, id, name) {
    return function(scope) {
      rest.verbose('createComponent', id, name);

      const args = {
        id: id,
        id32: util.toBytes32(id),
        name: name,
      };

      return rest.setScope(scope)
        .then(rest.getContractString(contractName, contractFilename))
        .then(rest.uploadContract(adminName, adminPassword, contractName, args))
        .then(function(scope) {
          return scope;
        });
    }
  }

  function addComponent(adminName, id, quantity) {
    return function(scope) {
      rest.verbose('addComponent', id, quantity);

      // function addComponent(bytes32 id32, string id, uint quantity) returns (ErrorCodesEnum)
      const method = 'addComponent';
      const args = {
        id: id,
        id32: util.toBytes32(id),
        quantity: quantity,
      };
      return rest.callMethod(adminName, contractName, method, args)(scope);
    }
  }

  function exists(adminName, id) {
    return function(scope) {
      rest.verbose('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> exists', id);

      // function exists(bytes32 id32) returns (bool)
      const method = 'exists';
      const args = {
        id32: util.toBytes32(id),
      };
      return rest.callMethod(adminName, contractName, method, args)(scope);
    }
  }

});
