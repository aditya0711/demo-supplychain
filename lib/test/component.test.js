const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const should = common.should;
const assert = common.assert;
const expect = common.expect;

describe('Component', function() {
  this.timeout(config.timeout);

  const scope = {};
  const adminName = util.uid('Admin');
  const adminPassword = '1234';
  const contractName = 'Component';

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
        const result = scope.states[contractName];
        const child0 = result.children[0];
        const id32Fixed = util.fixBytes(child0.id32);

        assert.equal(child0.id, child.id, 'id');
        assert.equal(id32Fixed, util.toBytes32(child.id), 'id32');
        assert.equal(child0.quantity, child.quantity, 'quantity');

        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });
});

function createComponent(adminName, adminPassword, id, name) {
  return function(scope) {
    rest.verbose('createComponent', {id}, {name});

    const contractName = 'Component';
    const contractFilename = config.contractsPath + '/component/Component.sol';
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
