const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'GovernUserManager';
const contractFilename = `${config.libPath}/user/contracts/GovernUserManager.sol`;

const ErrorCodes = rest.getEnums(`${config.libPath}/common/ErrorCodesEnum.sol`).ErrorCodes;
const GovernUserRole = rest.getEnums(`${config.libPath}/user/contracts/GovernUserRoleEnum.sol`).GovernUserRole;
const GovernUserState = rest.getEnums(`${config.libPath}/user/contracts/GovernUserStateEnum.sol`).GovernUserState;
const GovernUserEvent = rest.getEnums(`${config.libPath}/user/contracts/GovernUserEventEnum.sol`).GovernUserEvent;

const governUser = require('./governUser');

// util
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

// access methods
function createGovernUser(adminName, username, pwHash) {
  return function(scope) {
    rest.verbose('createGovernUser', username, pwHash);
    // function createGovernUser(string _username, bytes32 _pwHash) returns (ErrorCodes, address) {
    const method = 'createGovernUser';
    const args = {
      _username: username,
      _pwHash: pwHash,
    };
    return rest.callMethod(adminName, contractName, method, args)(scope)
      .then(function(scope) {
        // returns tuple (ErrorCodes, address)
        const tupleString = scope.contracts[contractName].calls[method];
        const tupleArray = tupleString.split(',');
        scope.result = {errorCode: tupleArray[0], address: tupleArray[1]};
        return scope;
      });
  }
}

function handleEvent(adminName, username, userEvent) {
  return function(scope) {
    rest.verbose('handleEvent', username, userEvent);

    const method = 'handleEvent';

    return rest.setScope(scope)
      .then( get(username) )
      .then(function (scope) {
        // function handleEvent(address userAddress, GovernUserEvent event) returns (ErrorCodes, GovernUserState) {
        const userAddress = scope.result[0].address;
        const args = {
          userAddress: userAddress,
          userEvent: userEvent,
        };
        return rest.callMethod(adminName, contractName, method, args)(scope);
      })
      .then(function(scope) {
        // returns tuple (ErrorCodes, GovernUserState)
        const tupleString = scope.contracts[contractName].calls[method];
        const tupleArray = tupleString.split(',');
        scope.result = {errorCode: tupleArray[0], state: tupleArray[1]};
        return scope;
      });
  }
}

// wrappers
function get(username) {
  return function (scope) {
    return governUser.get(username)(scope);
  }
}

function waitQuery(queryString, count, timeoutMilli, node) {
  return function (scope) {
    return governUser.waitQuery(queryString, count, timeoutMilli, node)(scope);
  }
}

module.exports = {
  compileSearch: compileSearch,
  createGovernUser: createGovernUser,
  get: get,
  getState: getState,
  handleEvent: handleEvent,
  uploadContract: uploadContract,
  waitQuery: waitQuery,

  ErrorCodes: ErrorCodes,
  GovernUserRole: GovernUserRole,
  GovernUserState: GovernUserState,
  GovernUserEvent: GovernUserEvent,
};
