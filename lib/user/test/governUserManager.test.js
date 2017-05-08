const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const userManager = require('../governUserManager');

const ErrorCodes = userManager.ErrorCodes;
const GovernUserRole = userManager.GovernUserRole;
const GovernUserState = userManager.GovernUserState;
const GovernUserEvent = userManager.GovernUserEvent;

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
      .then(userManager.uploadContract(adminName, adminPassword))
      .then(userManager.getState())
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        done();
      }).catch(done);
  });

  it('Create user', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash

    rest.setScope(scope)
      .then(userManager.uploadContract(adminName, adminPassword))
      // create a user
      .then(userManager.createGovernUser(adminName, username, pwHash))
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        assert.equal(result.errorCode, ErrorCodes.SUCCESS, 'createGovernUser should return ErrorCodes.SUCCESS');
        return scope;
      })
      // read it in a query
      .then(userManager.waitQuery(`username=eq.${username}`, 1))
      .then(function(scope) {
        const resultsArray = scope.query.slice(-1)[0];
        assert.equal(resultsArray.length, 1, 'one and only one');
        const result = resultsArray[0];
        console.log(result);
        assert.equal(result.role, GovernUserRole[GovernUserRole.MEMBER], 'new user role should be GovernUserRole.MEMBER');
        assert.equal(result.state, GovernUserState[GovernUserState.PENDING], 'new user state should be GovernUserState.PENDING');
        return scope;
      })
      // read it again
      .then(userManager.get(username))
      .then(function(scope) {
        console.log(scope.result);
        const resultsArray = scope.result;
        assert.equal(resultsArray.length, 1, 'one and only one');
        const result = resultsArray[0];
        assert.equal(result.role, GovernUserRole[GovernUserRole.MEMBER], 'new user role should be GovernUserRole.MEMBER');
        assert.equal(result.state, GovernUserState[GovernUserState.PENDING], 'new user state should be GovernUserState.PENDING');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('Create multiple users', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash

    // create all users
    const count = 5;
    const userArray = Array.apply(null, {
      length: count
    }).map(function (item, index) {
      return {
        username: username + '_' + index,
      };
    });

    rest.setScope(scope)
      .then(userManager.uploadContract(adminName, adminPassword))
      // add all users
      .then(function(scope) {
        return Promise.each(userArray, function(user) { // for each user
          return (userManager.createGovernUser(adminName, user.username, pwHash)(scope)); // create user
        }).then(function() { // all done
          return scope;
        });
      })
      // query for all the users
      .then(userManager.waitQuery(`username=like.%${username}%`, count, 120*1000))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it.only('Change state from PENDING to ACTIVE', function(done) {
    const username = util.uid('GovernUser');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash

    rest.setScope(scope)
      .then(userManager.uploadContract(adminName, adminPassword))
      // create a user
      .then(userManager.createGovernUser(adminName, username, pwHash))
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        assert.equal(result.errorCode, ErrorCodes.SUCCESS, 'createGovernUser should return ErrorCodes.SUCCESS');
        return scope;
      })
      // set the state
      .then(userManager.waitQuery(`username=eq.${username}`, 1))
      .then(userManager.handleEvent(adminName, username, GovernUserEvent.APPROVE))
      .then(function(scope) {
        const result = scope.result;
        console.log(result);
        assert.equal(result.errorCode, ErrorCodes.SUCCESS, 'handleEvent should return ErrorCodes.SUCCESS');
        assert.equal(result.state, GovernUserState.ACTIVE, 'handleEvent should return GovernUserState.ACTIVE');
        return scope;
      })
      // check the new state
      .then(userManager.waitQuery(`username=eq.${username}`, 1))
      .then(function(scope) {
        const resultsArray = scope.query.slice(-1)[0];
        assert.equal(resultsArray.length, 1, 'one and only one');
        const result = resultsArray[0];
        console.log(result);
        assert.equal(result.role, GovernUserRole[GovernUserRole.MEMBER], 'new user role should be GovernUserRole.MEMBER');
        assert.equal(result.state, GovernUserState[GovernUserState.ACTIVE], 'approved user state should be GovernUserState.ACTIVE');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

});
