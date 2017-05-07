const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const guMan = require('../governUserManager');

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

});
