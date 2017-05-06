const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const guser = require('../guser');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';

describe('GUser tests', function() {
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
    const username = util.uid('User');
    const pwHash = util.toBytes32('1234'); // FIXME this is not a hash

    const args = {
      _username: username,
      _pwHash: pwHash,
    };

    // create the user with constructor args
    rest.setScope(scope)
      .then(guser.uploadContract(adminName, adminPassword, args))
      .then(guser.getState())
      .then(function(scope) {
        const result = scope.result;

        console.log(result);
        assert.equal(result.username, username, 'username');
        assert.equal(util.fixBytes(result.pwHash), pwHash, 'pwHash');
        return scope;
      })
      .then(rest.waitQuery(`GUser?username=eq.${username}`, 1))
      .then(function(scope) {
        console.log(scope.query.slice(-1)[0]);
        done();
      }).catch(done);
  });
});
