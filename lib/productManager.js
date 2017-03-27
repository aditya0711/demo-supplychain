const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;
const assert = ba.common.assert;

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
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest.compileSearch(searchable, contractName, contractFilename));
  }
}

module.exports = {
  createProduct: createProduct,
  uploadContract: uploadContract,
  // exists: exists,
  // hasChild: hasChild,
  compileSearch: compileSearch,
};


/*
 var bucket = require('bucket-js');

 buckets.Set.prototype.toString = function() {
 //...
 }

 module.exports = bucket;
 */