const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const Promise = ba.common.Promise;

const contractName = 'ComponentManager';

function addComponent(adminName, id, name) {
  return function(scope) {
    rest.verbose('addComponent', id, name);

    // function addComponent(bytes32 id32, string id, string name) returns (ErrorCodesEnum)
    const method = 'addComponent';
    const args = {
      id: id,
      id32: util.toBytes32(id),
      name: name,
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
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

function compileSearch() {
  return function(scope) {
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest_compileSearch(searchable, contractName, contractFilename));
  }
}

module.exports = {
  exists: exists,
  addComponent: addComponent,
  compileSearch: compileSearch,
}

// FIXME into rest

function rest_compileSearch(searchableArray, contractName, contractFilename) {
  return function(scope) {

    const compileList = [{
      searchable: searchableArray,
      contractName: contractName,
    }];

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.compile(compileList))
      .then(function(scope) {
        const result = scope.compile.slice(-1)[0];
        const compiled = result.map(function(compiledContract) {
          return compiledContract.contractName;
        });
        const notFound = searchableArray.filter(function(searchable) {
          return compiled.indexOf(searchable) == -1;
        });
        // if found any items in the searchable list, that are not included in the compile list results
        assert.equal(notFound.length, 0, 'some searchables were not compiled ' + JSON.stringify(notFound, null, 2));
        return scope;
      });
  }
}
