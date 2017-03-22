const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const componentManager = require('../componentManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'ComponentManager';
const contractFilename = config.contractsPath + '/component/ComponentManager.sol';

const CIRRUS_TIMEOUT = 1*60*1000;

describe('ComponentManager tests', function () {
  this.timeout(config.timeout);

  const scope = {};

  // upload the component-manager contract
  before(function (done) {
    rest.setScope(scope)
      // setup search
      .then(componentManager.compileSearch())
      // create admin
      .then(rest.createUser(adminName, adminPassword))
      // upload ComponentManager
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('should add a component', function (done) {
    const parent = {
      id: util.uid('parentID'),
    };

    rest.setScope(scope)
      // create component
      .then(componentManager.createComponent(adminName, contractName, parent.id))
      // test creation - returns ErrorCodesEnum
      .then(function (scope) {
        const method = 'createComponent';
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, `${method} should return ${ErrorCodesEnum[ErrorCodesEnum.SUCCESS]}`);
        return scope;
      })
      // get the state
      .then(rest.getState(contractName))
      .then(function (scope) {
        const result = scope.states[contractName];
        const components = result['components'];
        assert.equal(components.length, 2, 'should have added 1 component');
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('check exists', function (done) {
    const parent = {
      id: util.uid('parentID'),
    };

    rest.setScope(scope)
      .then(existsTest(adminName, parent.id, false))
      .then(createComponentTest(adminName, parent.id, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, parent.id, true))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add duplicate id', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
    };

    rest.setScope(scope)
      .then(createComponentTest(adminName, parent.id, ErrorCodesEnum.SUCCESS))
      .then(createComponentTest(adminName, parent.id, ErrorCodesEnum.EXISTS))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add sub component', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
    };
    const child = {
      id: 'childID_' + uid,
      quantity: 123,
    };

    rest.setScope(scope)
      .then(createComponentTest(adminName, parent.id, ErrorCodesEnum.SUCCESS))
      .then(createComponentTest(adminName, child.id, ErrorCodesEnum.SUCCESS))
      .then(rest.waitQuery(`Component?_id=eq.${parent.id}`, 1, CIRRUS_TIMEOUT))
      .then(function (scope) {
        const result = scope.query.slice(-1)[0];
        const parent = result[0];
        const children = parent.children;
        assert.equal(children.length - 1, 0, 'no children yet');
        return scope;
      })
      .then(addSubComponentTest(adminName, parent.id, child.id, child.quantity, ErrorCodesEnum.SUCCESS))
      .then(rest.waitQuery(`Component?_id=eq.${parent.id}`, 1, CIRRUS_TIMEOUT))
      .then(function (scope) {
        const result = scope.query.slice(-1)[0];
        const parent = result[0];
        const children = parent.children;
        assert.equal(children.length - 1, 1, 'one child added');
        return scope;
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add multi level', function (done) {
    const uid = util.uid();
    const parent = {
      id: `id_${uid}`,
    };

    // create all component id
    const count = 5;
    const compArray = Array.apply(null, {
      length: count
    }).map(function (item, index) {
      return {
        id: parent.id + '_' + index,
      };
    });

    rest.setScope(scope)
    // add all components
      .then(function (scope) {
        return Promise.each(compArray, function (comp) { // for each component
          return rest.setScope(scope)
            .then(createComponentTest(adminName, comp.id, ErrorCodesEnum.SUCCESS))
            .then(rest.waitQuery(`Component?_id=eq.${comp.id}`, 1, CIRRUS_TIMEOUT))
        }).then(function () { // all done
          return scope;
        });
      })
      .then(rest.waitQuery(`Component?_id=like.%${parent.id}%`, count, CIRRUS_TIMEOUT))
      .then(addSubComponentTest(adminName, compArray[0].id, compArray[1].id, 1, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, compArray[1].id, compArray[2].id, 1, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, compArray[3].id, compArray[4].id, 1, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, compArray[4].id, compArray[2].id, 1, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, compArray[2].id, compArray[0].id, 1, ErrorCodesEnum.RECURSIVE))
      .then(addSubComponentTest(adminName, compArray[2].id, compArray[3].id, 1, ErrorCodesEnum.RECURSIVE))
      .then(hasChildTest(adminName, compArray[0].id, compArray[1].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[1].id, compArray[2].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[0].id, compArray[2].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[3].id, compArray[4].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[4].id, compArray[2].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[3].id, compArray[2].id, [ErrorCodesEnum.SUCCESS, true]))
      .then(hasChildTest(adminName, compArray[3].id, compArray[0].id, [ErrorCodesEnum.SUCCESS, false]))
      .then(hasChildTest(adminName, compArray[2].id, compArray[0].id, [ErrorCodesEnum.SUCCESS, false]))
      .then(hasChildTest(adminName, compArray[0].id, compArray[0].id, [ErrorCodesEnum.SUCCESS, false]))
      .then(hasChildTest(adminName, compArray[0].id, compArray[4].id, [ErrorCodesEnum.SUCCESS, false]))
      .then(function (scope) {
        done();
      }).catch(done);
  });

});

function hasChildTest(adminName, parentId, childId, expected) {
  return function (scope) {
    rest.verbose('hasChildTest', parentId, childId, expected);
    const method = 'hasChild';

    return rest.setScope(scope)
      .then(componentManager.hasChild(adminName, parentId, childId))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls[method].split(',');
        assert.equal(result[0], expected[0], `${method} should return ${expected}`);
        assert.equal(result[1] == 'true', expected[1], `${method} should return ${expected}`);
        return scope;
      });
  }
}

function createComponentTest(adminName, id, expected) {
  return function (scope) {
    rest.verbose('createComponent', expected);

    return rest.setScope(scope)
      .then(componentManager.createComponent(adminName, id))
      .then(function (scope) {
        const method = 'createComponent';
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, expected, `${method} should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}

function existsTest(adminName, id, expected) {
  return function (scope) {
    rest.verbose('existsTest', expected);
    const method = 'exists';

    return rest.setScope(scope)
      .then(componentManager.exists(adminName, id))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls[method] == 'true';
        assert.equal(result, expected, 'component exist');
        return scope;
      });
  }
}

function addSubComponentTest(adminName, parentId, childId, quantity, expected) {
  return function (scope) {
    rest.verbose('addSubComponentTest', expected);
    const method = 'addSubComponent';

    return rest.setScope(scope)
      .then(componentManager.addSubComponent(adminName, parentId, childId, quantity))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, expected, `${method} should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}
