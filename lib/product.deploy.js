const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;

const productManager = require('./productManager');

describe('Deploy product manager', function () {
  this.timeout(config.timeout);

  it('should create a product', function (done) {
  const scope = {};
    rest.setScope(scope)
      .then(productManager.compileSearch())
      .then(function (scope) {
        done();
      }).catch(done);
  });
});
