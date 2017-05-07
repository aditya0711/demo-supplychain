const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'GovernUserManager';
const contractFilename = `${config.libPath}/user/contracts/GovernUserManager.sol`;

const ErrorCodes = rest.getEnums(`${config.libPath}/common/ErrorCodesEnum.sol`).ErrorCodes;
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

function createGovernUser(adminName, username, pwHash, role, state) {
  rest.verbose('createGovernUser', username, pwHash, role, state);
  return function(scope) {
    // function createGovernUser(string _username, bytes32 _pwHash, GovernUserRole _role, GovernUserState _state) returns (ErrorCodes, address) {
    const method = 'createGovernUser';
    const args = {
      _username: username,
      _pwHash: pwHash,
      _role: role,
      _state: state,
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

module.exports = {
  compileSearch: compileSearch,
  createGovernUser: createGovernUser,
  getState: getState,
  uploadContract: uploadContract,

  ErrorCodes: ErrorCodes,
  GovernUserRole: GovernUserRole,
  GovernUserState: GovernUserState,
};
