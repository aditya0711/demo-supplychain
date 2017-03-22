const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'Component';

const component = require('../component');

describe('Component', function() {
  this.timeout(config.timeout);

  const scope = {};

  before(function(done) {
    rest.setScope(scope)
      .then(component.compileSearch())
      .then(rest.createUser(adminName, adminPassword))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('upload a contract with constructor args', function(done) {
    const id = util.uid('ID');

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(component.createComponent(adminName, adminPassword, id))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const id32Fixed = util.fixBytes(result._id32);

        assert.equal(result._id, id, 'id');
        assert.equal(id32Fixed, util.toBytes32(id), 'id32');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add component', function(done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
    };
    const child = {
      id: 'childID_' + uid,
      quantity: 123,
    };

    // function addSubComponent(Component childAddress, uint quantity) returns (ErrorCodesEnum)
    const childArgs = {
      childAddress: undefined,
      quantity: child.quantity,
    };

    // call add() and test if it worked
    rest.setScope(scope)
      .then(component.createComponent(adminName, adminPassword, child.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        return scope;
      })
      .then(component.createComponent(adminName, adminPassword, parent.id))
      .then(component.addSubComponent(adminName, childArgs))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const child1 = result['children'][1];
        // console.log(child1);
        const id32Fixed = util.fixBytes(child1.id32);

        assert.equal(child1['adrs'], childArgs.childAddress, 'address');
        assert.equal(id32Fixed, util.toBytes32(child.id), 'id32');
        assert.equal(child1['quantity'], child.quantity, 'quantity');

        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('check child exists', function(done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
      name: 'parentName_' + uid,
    };
    const child = {
      id: 'childID_' + uid,
      name: 'childName_' + uid,
      quantity: 123,
    };

    const childArgs = {};

    // call exists() before and after add()
    rest.setScope(scope)
      // create child
      .then(component.createComponent(adminName, adminPassword, child.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = child.quantity;
        return scope;
      })
      // create parent
      .then(component.createComponent(adminName, adminPassword, parent.id))
      .then(existsTest(adminName, child.id, false))
      .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, child.id, true))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add duplicate child', function(done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
    };
    const child = {
      id: 'childID_' + uid,
      quantity: 123,
    };
    const childArgs = {};

    // add duplicate
    rest.setScope(scope)
      // create child
      .then(component.createComponent(adminName, adminPassword, child.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = child.quantity;
        return scope;
      })
      // create parent
      .then(component.createComponent(adminName, adminPassword, parent.id))
      .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.EXISTS))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add self as child', function(done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
    };
    const childArgs = {};

    // add duplicate
    rest.setScope(scope)
      .then(component.createComponent(adminName, adminPassword, parent.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = 456;
        return scope;
      })
      .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.RECURSIVE))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('query', function(done) {

    const parent = {
      id: util.uid('ID'),
    };

    // create all component names
    const count = 5;
    const compArray = Array.apply(null, {
      length: count
    }).map(function(item, index) {
      return {
        id: parent.id + '_' + index,
      };
    });

    rest.setScope(scope)
      // add all components
      .then(function(scope) {
        return Promise.each(compArray, function(parent) { // for each component
          return (component.createComponent(adminName, adminPassword, parent.id)(scope)); // add component
        }).then(function() { // all done
          return scope;
        });
      })
      // query for the components
      .then(rest.waitQuery(`Component?_id=like.%${parent.id}%`, count, 120*1000))
      .then(function(scope) {
        const result = scope.query.slice(-1)[0];
        // const notIncluded = filterNotIncluded(compArray, result);
        const comparator = function(source, target) { return source.id == target._id; };
        const notIncluded = filter_SourceNotInTarget(compArray, result, comparator);
        // if found any items in the source list, that are not included in the query results
        assert.equal(notIncluded.length, 0, 'some components were not created ' + JSON.stringify(notIncluded, null, 2));
        return scope;
      })
      // test the filter
      .then(function(scope) {
        compArray.push({id: 'ID_666'});
        const result = scope.query.slice(-1)[0];
        const comparator = function(source, target) { return source.id == target._id; };
        const notIncluded = filter_SourceNotInTarget(compArray, result, comparator);
        // should find 1 not included
        assert.equal(notIncluded.length, 1, 'the filter should find 1 exception' + JSON.stringify(notIncluded, null, 2));
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

});

function addSubComponentTest(adminName, childArgs, expected) {
  return function(scope) {
    rest.verbose('addSubComponentTest', expected);

    return rest.setScope(scope)
      .then(component.addSubComponent(adminName, childArgs))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['addSubComponent'];
        assert.equal(result, expected, 'addSubComponent should return ' + ErrorCodesEnum[expected]);
        return scope;
      });
  }
}

function existsTest(adminName, id, expected) {
  return function(scope) {
    rest.verbose('existsTest', expected);

    return rest.setScope(scope)
      .then(component.exists(adminName, id))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['exists'] == 'true';
        assert.equal(result, expected, 'child exist');
        return scope;
      });
  }
}

// FIXME into util

function filter_SourceNotInTarget(source, target, comparator) {
  console.log('source', source);
  console.log('target', target);
  return source.filter(function(sourceComp) {
    return !target.filter(function(targetComp) {
        // compare
        return comparator(sourceComp, targetComp);
      }).length > 0; // some items were found in the source that are not included in the target
  });
}
