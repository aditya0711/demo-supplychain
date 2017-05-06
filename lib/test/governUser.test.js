const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const governuser = require('../governUser');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const GovernUserRole = rest.getEnums(`${config.contractsPath}/enums/GovernUserRoleEnum.sol`).GovernUserRole;
const GovernUserState = rest.getEnums(`${config.contractsPath}/enums/GovernUserStateEnum.sol`).GovernUserState;
const adminName = util.uid('Admin');
const adminPassword = '1234';

describe('Govern User tests', function() {
  this.timeout(config.timeout);

  const scope = {};

  before(function (done) {
    rest.setScope(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('Create Contract', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash
    const role = 1;
    const state = 2;

    const args = {
      _username: username,
      _pwHash: pwHash,
      _role: role,
      _state: state,
    };

    // create the user with constructor args
    rest.setScope(scope)
      .then(governuser.uploadContract(adminName, adminPassword, args))
      .then(governuser.getState())
      .then(function(scope) {
        const result = scope.result;

        console.log(result);
        assert.equal(result.username, username, 'username');
        assert.equal(util.fixBytes(result.pwHash), pwHash, 'pwHash');
        assert.equal(result.role.value, role, 'role');
        assert.equal(result.state.value, state, 'state');
        return scope;
      })
      .then(rest.waitQuery(`GovernUser?username=eq.${username}`, 1))
      .then(function(scope) {
        console.log(scope.query.slice(-1)[0]);
        done();
      }).catch(done);
  });

  it('Construct GovernUser', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash
    const role = GovernUserRole.MEMBER;
    const state = GovernUserState.PENDING;

    const args = {
      _username: username,
      _pwHash: pwHash,
      _role: role,
      _state: state,
    };

    // create the user with constructor args
    rest.setScope(scope)
      .then(governuser.uploadContract(adminName, adminPassword, args))
      .then(governuser.waitQuery(username)) // must be here
      .then(governuser.get(username))
      .then(function(scope) {
        // only 1 result
        assert.equal(scope.result.length, 1, 'must get only 1 result');
        // check values
        const result = scope.result[0];
        assert.equal(result.username, username, 'username');
        assert.equal(result.pwHash, pwHash, 'pwHash');
        assert.equal(result.role, GovernUserRole[role], 'role');
        assert.equal(result.state, GovernUserState[state], 'state');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it.only('Set role / state', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash
    const role = GovernUserRole.MEMBER;
    const state = GovernUserState.PENDING;

    const args = {
      _username: username,
      _pwHash: pwHash,
      _role: role,
      _state: state,
    };

    const newRole = GovernUserRole.ADMIN;
    const newState = GovernUserState.SUSPENDED;

    // create the user with constructor args
    rest.setScope(scope)
      .then(governuser.uploadContract(adminName, adminPassword, args))
      .then(governuser.waitQuery(username)) // must be here
      .then(function(scope) {
        const queryResult = scope.query.slice(-1)[0];
        const result = queryResult[0];
        assert.equal(result.role, GovernUserRole[role], 'role'); // from constructor
        return scope;
      })
      .then(governuser.setRole(adminName, username, newRole))
      .then(governuser.setState(adminName, username, newState))
      .then(governuser.get(username))
      .then(function(scope) {
        const result = scope.result[0];
        assert.equal(result.role, GovernUserRole[newRole], 'New Role');
        assert.equal(result.state, GovernUserState[newState], 'New State');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

});
