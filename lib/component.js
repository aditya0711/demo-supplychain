const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;
const assert = ba.common.assert;

const contractName = 'Component';
const contractFilename = config.contractsPath + '/component/Component.sol';

function compileSearch() {
  return function(scope) {
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest.compileSearch(searchable, contractName, contractFilename));
  }
}

function createComponent(adminName, adminPassword, id) {
  return function(scope) {
    rest.verbose('createComponent', {id});

    const args = {
      _id: id,
      _id32: util.toBytes32(id),
    };

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args));
  }
}

function addSubComponent(adminName, args) {
  return function(scope) {
    rest.verbose('addSubComponent', {args});

    // function addSubComponent(address childAddress, uint quantity) returns (ErrorCodesEnum) {
    const method = 'addSubComponent';
    return rest.setScope(scope)
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(rest.waitNextBlock());
  }
}

function exists(adminName, id) {
  return function(scope) {
    rest.verbose('exists', id);

    // function exists(bytes32 id32) returns (bool)
    const method = 'exists';
    const args = {
      _id32: util.toBytes32(id),
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
  }
}


module.exports = {
  addSubComponent: addSubComponent,
  exists: exists,
  createComponent: createComponent,
  compileSearch: compileSearch,
};

