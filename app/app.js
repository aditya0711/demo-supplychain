const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const Promise = ba.common.Promise;

// FIXME move to rest
function MethodError(contract, method, result) { // FIXME move to rest
  return new Error('Call to ' + contract + '.' + method + '() returned ' + result);
}

const productManager = require('../lib/productManager');

// ========== Admin (chain super user) ==========

function setAdmin(adminName, adminPassword, aiAddress) {
  return function(scope) {
    rest.verbose('setAdmin', adminName, adminPassword, aiAddress);
    return nop(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(getAdminInterface(aiAddress))
      .then(function(scope) {
        for (var name in AI.subContractsNames) {
          if (scope.contracts[name] === undefined) throw new Error('setAdmin: AdminInterface: undefined: ' + name);
          if (scope.contracts[name] === 0) throw new Error('setAdmin: AdminInterface: 0: ' + name);
          if (scope.contracts[name].address == 0) throw new Error('setAdmin: AdminInterface: address 0: ' + name);
        };
        return scope;
      });
  }
}

// ========== Admin Interface ==========
const AI = {
  contractsPath: undefined,
  subContractsNames: {
    ProductManager: 'ProductManager',
  },
  contractName: 'AdminInterface',
  contractFilename: 'AdminInterface.sol',
};

function setAdminInterface(adminName, adminPassword) {
  rest.verbose('setAdminInterface', arguments);
  const contractName = AI.contractName;
  const contractFilename = AI.contractsPath + AI.contractFilename;
  return function(scope) {
    return nop(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(function(scope) {
        const address = scope.contracts[contractName].address;
        if (!util.isAddress(address)) throw new Error('setAdminInterface: upload failed: address:', address);
        return scope;
      });
  }
}

function getAdminInterface(address) {
  rest.verbose('getAdminInterface', {address});
  return function(scope) {
    // if address not passed in, it is in the scope
    if (address === undefined) {
      address = scope.contracts[AI.contractName].address;
    }
    const contractName = 'AdminInterface';
    return rest.getState(contractName, address)(scope)
      .then(function(scope) {
        for (var name in scope.states[contractName]) {
          var address = scope.states[contractName][name];
          if (address == 0) throw new Error(`getAdminInterface: interface not set: ${name}`);
          // capitalize first letter to match the contract name on the chain
          var capName = name[0].toUpperCase() + name.substring(1);
          scope.contracts[capName] = {
            address: address
          };
        };
        return scope;
      });
  }
}

function compileSearch() {
  return function(scope){
    return nop(scope)
      .then(productManager.compileSearch());
  }
}

// ========== util ==========

// setup the common containers in the scope
function setScope(scope) {
  if (scope === undefined) scope = {};
  return new Promise(function(resolve, reject) {
    rest.setScope(scope).then(function(scope) {
      // add project specific scope items here
      scope.name = 'demo-app';
      scope.store = {};
      resolve(scope);
    });
  });
}

function nop(scope) {
  return new Promise(function(resolve, reject) {
    resolve(scope);
  });
}

module.exports = function(contractsPath) {
  rest.verbose('construct', {contractsPath});
  AI.contractsPath = contractsPath;

  return {
    AI: AI,
    compileSearch: compileSearch,
    getAdminInterface: getAdminInterface,
    setAdmin: setAdmin,
    setAdminInterface: setAdminInterface,
    setScope: setScope,
  };
};
