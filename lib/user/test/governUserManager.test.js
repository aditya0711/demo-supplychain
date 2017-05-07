const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const guMan = require('../governUserManager');

const ErrorCodes = guMan.ErrorCodes;
const GovernUserRole = guMan.GovernUserRole;
const GovernUserState = guMan.GovernUserState;

const adminName = util.uid('Admin');
const adminPassword = '1234';

describe('Govern User Manager tests', function() {
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
    // create the contract
    rest.setScope(scope)
      .then(guMan.uploadContract(adminName, adminPassword))
      .then(guMan.getState())
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        done();
      }).catch(done);
  });

  it('Create user', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash
    const role = guMan.GovernUserRole.MEMBER;
    const state = guMan.GovernUserState.PENDING;

    rest.setScope(scope)
      .then(guMan.uploadContract(adminName, adminPassword))
      // create a user
      .then(guMan.createGovernUser(adminName, username, pwHash, role, state))
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        assert.equal(result.errorCode, ErrorCodes.SUCCESS, 'createGovernUser should return ErrorCodes.SUCCESS');
        return scope;
      })
      // read it in a query
      .then(rest.waitQuery(`GovernUser?username=eq.${username}`, 1))
      .then(function(scope) {
        const resultsArray = scope.query.slice(-1)[0];
        assert.equals(resultsArray.length, 1, 'one and only one');
        const result = resultsArray[0];
        console.log(result);
        assert.equal(result.role, GovernUserRole[GovernUserRole.MEMBER], 'new user role should be GovernUserRole.MEMBER');
        assert.equal(result.state, GovernUserState[GovernUserState.PENDING], 'new user state should be GovernUserState.PENDING');
        return scope;
      })
      // read it again
      .then(guMan.get(username))
      .then(function(scope) {
        console.log(scope.result);
        const resultsArray = scope.result;
        assert.equals(resultsArray.length, 1, 'one and only one');
        const result = resultsArray[0];
        assert.equal(result.role, GovernUserRole[GovernUserRole.MEMBER], 'new user role should be GovernUserRole.MEMBER');
        assert.equal(result.state, GovernUserState[GovernUserState.PENDING], 'new user state should be GovernUserState.PENDING');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });


});
