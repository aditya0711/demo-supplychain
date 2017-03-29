const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'ProductManager';
const contractFilename = config.contractsPath + '/component/ProductManager.sol';

function uploadContract(adminName, adminPassword) {
  return function(scope) {
    rest.verbose('uploadContract');

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(rest.waitNextBlock());
  }
}

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

function compileSearch() {
  return function (scope) {
    // depends on Product
    const product = require('./product');

    const searchable = [contractName];
    return rest.setScope(scope)
      .then(product.compileSearch())
      .then(rest.compileSearch(searchable, contractName, contractFilename));
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

function link(adminName, parentId, childId, quantity) {
  return function(scope) {
    rest.verbose('link', parentId, childId, quantity);

    // function link(bytes32 parentId32, bytes32 childId32, uint quantity) returns (ErrorCodesEnum)
    const method = 'link';
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

module.exports = {
  compileSearch: compileSearch,
  createProduct: createProduct,
  exists: exists,
  hasChild: hasChild,
  link: link,
  uploadContract: uploadContract,
};
