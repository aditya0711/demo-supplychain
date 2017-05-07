const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;

const componentManager = require('./componentManager');
const productManager = require('./productManager');

describe('Deploy product manager', function () {
  this.timeout(config.timeout);

  it('should deploy', function (done) {
  const scope = {};
    rest.setScope(scope)
      .then(componentManager.compileSearch())
      .then(productManager.compileSearch())
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
