const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'GovernUser';
const contractFilename = `${config.libPath}/user/contracts/GovernUser.sol`;

const GovernUserRole = rest.getEnums(`${config.libPath}/user/contracts/GovernUserRoleEnum.sol`).GovernUserRole;
const GovernUserState = rest.getEnums(`${config.libPath}/user/contracts/GovernUserStateEnum.sol`).GovernUserState;

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

function waitQuery(queryString, count, timeoutMilli, node) {
  return function (scope) {
    return governUser.waitQuery(queryString, count, timeoutMilli, node)(scope);
  }
}

function waitQuery(queryString, count, timeMilli, node) {
  return function (scope) {
    return rest.setScope(scope)
      .then(rest.waitQuery(`${contractName}?${queryString}`, count, timeMilli, node));
  }
}

function setRole(adminName, username, role) {
  return function (scope) {
    return rest.setScope(scope)
      .then( get(username) )
      .then(function (scope) {
        const contractAddress = scope.result[0].address;
        const method = 'setRole';
        const args = {
          _role: role,
        };
        return rest.callMethodAddress(adminName, contractName, contractAddress, method, args)(scope);
      });
  }
}

function setState(adminName, username, state) {
  return function (scope) {
    return rest.setScope(scope)
      .then( get(username) )
      .then(function (scope) {
        const contractAddress = scope.result[0].address;
        const method = 'setState';
        const args = {
          _state: state,
        };
        return rest.callMethodAddress(adminName, contractName, contractAddress, method, args)(scope);
      });
  }
}

module.exports = {
  compileSearch: compileSearch,
  getState: getState,
  get: get,
  setRole: setRole,
  setState: setState,
  uploadContract: uploadContract,
  waitQuery: waitQuery,

  GovernUserRole: GovernUserRole,
  GovernUserState: GovernUserState,
};
