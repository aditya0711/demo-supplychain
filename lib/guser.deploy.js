const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;

const guser = require('./guser');

describe('Deploy guser', function () {
  this.timeout(config.timeout);

  it('should deploy', function (done) {
  const scope = {};
    rest.setScope(scope)
      .then(guser.compileSearch())
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
