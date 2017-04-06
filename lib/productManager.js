const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;
const Promise = ba.common.Promise;

const contractName = 'ProductManager';
const contractFilename = config.contractsPath + '/component/ProductManager.sol';

function uploadContract(adminName, adminPassword) {
  return function (scope) {
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
      .then(function (scope) {
        scope.result = scope.contracts[contractName].calls[method];
        return scope;
      })
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
  return function (scope) {
    rest.verbose('exists', id);

    // function exists(bytes32 id32) returns (bool)
    const method = 'exists';
    const args = {
      id32: util.toBytes32(id),
    };
    return rest.setScope(scope)
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(function (scope) {
        scope.result = scope.contracts[contractName].calls[method] == 'true';
        return scope;
      });
  }
}

function link(adminName, parentId, childId, quantity) {
  return function (scope) {
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
      .then(function (scope) {
        scope.result = scope.contracts[contractName].calls[method];
        return scope;
      })
      .then(rest.waitNextBlock());
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
    return rest.setScope(scope)
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(function (scope) {
        const split = scope.contracts[contractName].calls[method].split(',');
        scope.result = [split[0], split[1] == 'true'];
        return scope;
      });
  }
}

function getState() {
  return function (scope) {
    return rest.setScope(scope)
      .then(rest.getState(contractName))
      .then(function (scope) {
        scope.result = scope.states[contractName];
        return scope;
      });
  }
}

function getProduct(id) {
  return function (scope) {
    rest.verbose('getProduct', {id});

    return rest.setScope(scope)
      .then(rest.query(`Product?id=eq.${id}`))
      .then(function (scope) {
        const result = scope.query.slice(-1)[0];
        if (result.length == 0) throw new Error(`Not Found: id: ${id}`);
        if (result.length > 1) throw new Error(`Non Unique: id: ${id}`);
        const product = result[0];
        // remove the first empty child
        product['children'] = product['children'].slice(1);
        scope.result = product;
        // no children - end the recursion
        if (product['children'].length == 0) {
          return scope;
        }
        // scan all children
        return Promise.each(product.children, function (child, index) {
          const childScope = {};
          child['id'] = util.fromBytes32(child[['id32']]);
          return rest.setScope(childScope)
            .then(getProduct(child['id']))
            .then(function (childScope) {
              // replace the partial child data, with the full state
              product['children'][index] = childScope.result;
              return childScope;
            });
        }).then(function () {
          return scope; // Promise.each done
        });
      });
  }
}

module.exports = {
  compileSearch: compileSearch,
  createProduct: createProduct,
  getProduct: getProduct,
  getState: getState,
  exists: exists,
  hasChild: hasChild,
  link: link,
  uploadContract: uploadContract,
};
