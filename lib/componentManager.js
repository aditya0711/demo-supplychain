const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'ComponentManager';
const contractFilename = config.contractsPath + '/component/ComponentManager.sol';

function createComponent(adminName, id) {
  return function(scope) {
    rest.verbose('createComponent', id);

    // function createComponent(bytes32 id32, string id) returns (ErrorCodesEnum)
    const method = 'createComponent';
    const args = {
      id: id,
      id32: util.toBytes32(id),
    };
    return rest.setScope(scope)
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(rest.waitNextBlock());
  }
}

function addSubComponent(adminName, parentId, childId, quantity) {
  return function(scope) {
    rest.verbose('addSubComponent', parentId, childId, quantity);

    // function addSubComponent(bytes32 parentId32, bytes32 childId32, uint quantity) returns (ErrorCodesEnum)
    const method = 'addSubComponent';
    const args = {
      parentId32: util.toBytes32(parentId),
      childId32: util.toBytes32(childId),
      quantity: quantity,
    };
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
      id32: util.toBytes32(id),
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
  }
}

function hasChild(adminName, parentId, childId) {
  return function(scope) {
    rest.verbose('hasChild', parentId, childId);

    // function hasChild(bytes32 parentId32, bytes32 childId32) returns (ErrorCodesEnum, bool)
    const method = 'hasChild';
    const args = {
      parentId32: util.toBytes32(parentId),
      childId32: util.toBytes32(childId),
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
  }
}

function compileSearch() {
  return function(scope) {
    // depends on Component
    const component = require('./component');

    const searchable = [contractName];
    return rest.setScope(scope)
      .then(component.compileSearch())
      .then(rest.compileSearch(searchable, contractName, contractFilename));
  }
}

module.exports = {
  addSubComponent: addSubComponent,
  exists: exists,
  hasChild: hasChild,
  createComponent: createComponent,
  compileSearch: compileSearch,
};