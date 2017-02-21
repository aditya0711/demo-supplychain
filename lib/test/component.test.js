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
  const contractFilename = config.contractsPath + '/component/Component.sol';

  it('upload a contract with constructor args', function(done) {
    const id = util.uid('ID');
    const id32 = util.toBytes32(id);
    const name = util.uid('name');

    const args = {
      id: id,
      id32: id32,
      name: name,
    };

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const id32Fixed = util.fixBytes(result._id32);

        assert.equal(result._id, id, 'id');
        assert.equal(id32Fixed, id32, 'id32');
        assert.equal(result._name, name, 'name');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });
});
