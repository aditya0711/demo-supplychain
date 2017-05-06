const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'GovernUser';
const contractFilename = config.contractsPath + '/guser/GovernUser.sol';

function compileSearch() {
  return function(scope) {
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest.compileSearch(searchable, contractName, contractFilename));
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

function uploadContract(adminName, adminPassword, args) {
  return function(scope) {
    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args))
      // .then(rest.waitNextBlock());
  }
}

function get(username) {
  return function (scope) {
    return rest.setScope(scope)
      .then(rest.query(`${contractName}?username=eq.${username}`))
      .then(function (scope) {
        scope.result = scope.query.slice(-1)[0];
        return scope;
      });
  }
}

function waitQuery(username) {
  return function (scope) {
    return rest.setScope(scope)
      .then(rest.waitQuery(`GovernUser?username=eq.${username}`, 1));
  }
}

module.exports = {
  compileSearch: compileSearch,
  getState: getState,
  get: get,
  uploadContract: uploadContract,
  waitQuery: waitQuery,
};