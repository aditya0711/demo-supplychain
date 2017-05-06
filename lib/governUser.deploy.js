const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;

const governUser = require('./governUser');

describe('Deploy govern user', function () {
  this.timeout(config.timeout);

  it('should deploy', function (done) {
  const scope = {};
    rest.setScope(scope)
      .then(governUser.compileSearch())
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
