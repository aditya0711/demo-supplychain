const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;
const assert = ba.common.assert;

const contractName = 'ProductManager';
const contractFilename = config.contractsPath + '/component/ProductManager.sol';

function createProduct(adminName, id, name, price) {
  return function (scope) {
    rest.verbose('createProduct', id, name, price);

    // function createProduct(bytes32 id32, string id, string name, uint price) returns (ErrorCodesEnum)
    const method = 'createProduct';
    const args = {
      id: id,
      id32: util.toBytes32(id),
      name: name,
      price: price,
    };
    return rest.setScope(scope)
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(rest.waitNextBlock());
  }
}

function addSubComponent(adminName, parentId, childId, quantity) {
  return function (scope) {
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
  return function (scope) {
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
  return function (scope) {
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
  return function (scope) {
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest_compileSearch(searchable, contractName, contractFilename));
  }
}

module.exports = {
  createProduct: createProduct,
  exists: exists,
  hasChild: hasChild,
  compileSearch: compileSearch,
};

// FIXME into rest

function rest_compileSearch(searchableArray, contractName, contractFilename) {
  return function (scope) {

    const compileList = [{
      searchable: searchableArray,
      contractName: contractName,
    }];

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.compile(compileList))
      .then(function (scope) {
        const result = scope.compile.slice(-1)[0];
        const compiled = result.map(function (compiledContract) {
          return compiledContract.contractName;
        });
        const notFound = searchableArray.filter(function (searchable) {
          return compiled.indexOf(searchable) == -1;
        });
        // if found any items in the searchable list, that are not included in the compile list results
        assert.equal(notFound.length, 0, 'some searchables were not compiled ' + JSON.stringify(notFound, null, 2));
        return scope;
      });
  }
}
