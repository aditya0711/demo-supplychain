const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;

const componentManager = require('./componentManager');

describe('Deploy component manager', function () {
  this.timeout(config.timeout);

  it('should compile component', function (done) {
  const scope = {};
    rest.setScope(scope)
      .then(componentManager.compileSearch())
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
