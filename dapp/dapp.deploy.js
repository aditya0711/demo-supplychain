const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const should = common.should;
const assert = common.assert;
const expect = common.expect;
const Promise = common.Promise;

// ---------------------------------------------------
//   deploy the projects contracts
// ---------------------------------------------------

const app = require('./dapp')(config.contractsPath);
const AI = app.AI;
assert.isDefined(AI.subContractsNames['ProductManager']);

describe('Demo App - deploy contracts', function () {
  this.timeout(900 * 1000);

  const scope = {};
  const adminName = util.uid('Admin');
  const adminPassword = '1234';

  // uploading the admin contract and dependencies
  it('should upload the contracts', function (done) {
    app.setScope(scope)
    // compile search
      .then(app.compileSearch())
      // set admin interface
      .then(app.setAdminInterface(adminName, adminPassword))
      // sanity check - get the freshly set admin interface
      .then(function (scope) {
        const address = scope.contracts[AI.contractName].address;
        scope.contracts[AI.contractName].string = 'removed to save screen space -LS';
        return app.getAdminInterface(address)(scope);
      })
      // write the deployment data to file
      .then(function (scope) {
        const object = {
          url: config.getBlocUrl(),
          adminName: adminName,
          adminPassword: adminPassword,
          AdminInterface: {
            address: scope.contracts[AI.contractName].address,
          },
        };
        console.log(config.deployFilename);
        console.log(fsutil.yamlSafeDumpSync(object));
        fsutil.yamlWrite(object, config.deployFilename);
        done();
      }).catch(done);
  });
});
