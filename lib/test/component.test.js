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

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'Component';
const contractFilename = config.contractsPath + '/component/Component.sol';

describe('Component', function() {
  this.timeout(config.timeout);

  const scope = {};

  before(function(done) {
    rest.setScope(scope)
      .then(compileSearch())
      .then(rest.createUser(adminName, adminPassword))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('upload a contract with constructor args', function(done) {
    const id = util.uid('ID');
    const name = util.uid('name');

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, id, name))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const id32Fixed = util.fixBytes(result._id32);

        assert.equal(result._id, id, 'id');
        assert.equal(id32Fixed, util.toBytes32(id), 'id32');
        assert.equal(result._name, name, 'name');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add component', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 123,
    };

    // function addSubComponent(bytes32 id32, string id, uint quantity) {
    const method = 'addSubComponent';
    const args = {
      id32: util.toBytes32(child.id),
      id: child.id,
      quantity: child.quantity,
    };

    // call add() and test if it worked
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(rest.callMethod(adminName, contractName, method, args))
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName].children[1];
        const id32Fixed = util.fixBytes(result.id32);

        assert.equal(result.id, child.id, 'id');
        assert.equal(id32Fixed, util.toBytes32(result.id), 'id32');
        assert.equal(result.quantity, child.quantity, 'quantity');

        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('check child exists', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 123,
    };

    // call exists() before and after add()
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(existsTest(adminName, child.id, false))
      .then(addSubComponentTest(adminName, child.id, child.quantity, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, child.id, true))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add duplicate child', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };
    const child = {
      id: util.uid('childID'),
      name: util.uid('childName'),
      quantity: 123,
    };

    // add duplicate
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(addSubComponentTest(adminName, child.id, child.quantity, ErrorCodesEnum.SUCCESS))
      .then(addSubComponentTest(adminName, child.id, child.quantity, ErrorCodesEnum.EXISTS))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('add recursive child', function(done) {
    const parent = {
      id: util.uid('parentID'),
      name: util.uid('parentName'),
    };

    // add duplicate
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(addSubComponentTest(adminName, parent.id, 1, ErrorCodesEnum.RECURSIVE))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  it('query', function(done) {

    const parent = {
      id: util.uid('ID'),
      name: util.uid('Name'),
    };

    // create all component names
    var count = 5;
    const compArray = Array.apply(null, {
      length: count
    }).map(function(item, index) {
      return {
        id: parent.id + '_' + index,
        name: parent.name + '_' + index,
      };
    });

    rest.setScope(scope)
      // add all components
      .then(function(scope) {
        return Promise.each(compArray, function(parent) { // for each component
          return (createComponent(adminName, adminPassword, parent.id, parent.name)(scope)) // add component
        }).then(function() { // all done
          return scope;
        });
      })
      // query
      .then(rest.query('Component'))
      .then(function(scope) {
        const result = scope.query.slice(-1)[0];
        const notIncluded = filterNotIncluded(compArray, result);
        // if found any items in the source list, that are not included in the query results
        assert.equal(notIncluded.length, 0, 'some components were not created ' + JSON.stringify(notIncluded, null, 2));
        return scope;
      })
      // test the filter
      .then(function(scope) {
        compArray.push({id: 'ID_666', name: 'name_666'});
        const result = scope.query.slice(-1)[0];
        const notIncluded = filterNotIncluded(compArray, result);
        // should find 1 not included
        assert.equal(notIncluded.length, 1, 'the filter should find 1 exception');
        return scope;
      })
      .then(function(scope) {
        done();
      }).catch(done);
  });

});

function createComponent(adminName, adminPassword, id, name) {
  return function(scope) {
    rest.verbose('createComponent', id, name);

    const args = {
      id: id,
      id32: util.toBytes32(id),
      name: name,
    };

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args));
  }
}

function addSubComponent(adminName, id, quantity) {
  return function(scope) {
    rest.verbose('addSubComponent', id, quantity);

    // function addSubComponent(bytes32 id32, string id, uint quantity) returns (ErrorCodesEnum)
    const method = 'addSubComponent';
    const args = {
      id: id,
      id32: util.toBytes32(id),
      quantity: quantity,
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
  }
}

function addSubComponentTest(adminName, id, quantity, expected) {
  return function(scope) {
    rest.verbose('addSubComponentTest', expected);

    return rest.setScope(scope)
      .then(addSubComponent(adminName, id, quantity))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['addSubComponent'];
        assert.equal(result, expected, 'addSubComponent should return ' + ErrorCodesEnum[expected]);
        return scope;
      });
  }
}

function exists(adminName, id) {
  return function(scope) {
    rest.verbose('exists', id);

    // function exists(bytes32 id32) returns (bool)
    const method = 'exists';
    const args = {
      id32: util.toBytes32(id),
    };
    return rest.callMethod(adminName, contractName, method, args)(scope);
  }
}

function existsTest(adminName, id, expected) {
  return function(scope) {
    rest.verbose('existsTest', expected);

    return rest.setScope(scope)
      .then(exists(adminName, id))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls['exists'] == 'true';
        assert.equal(result, expected, 'child exist');
        return scope;
      });
  }
}

function compileSearch() {
  return function(scope) {
    const searchable = ['Component'];
    return rest.setScope(scope)
      .then(rest_compileSearch(searchable, contractName, contractFilename));
  }
}

function rest_compileSearch(searchableArray, contractName, contractFilename) {
  return function(scope) {

    const compileList = [{
      searchable: searchableArray,
      contractName: contractName,
    }];

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.compile(compileList))
      .then(function(scope) {
        const result = scope.compile.slice(-1)[0];
        const compiled = result.map(function(compiledContract) {
          return compiledContract.contractName;
        });
        const notFound = searchableArray.filter(function(searchable) {
          return compiled.indexOf(searchable) == -1;
        });
        // if found any items in the searchable list, that are not included in the compile list results
        assert.equal(notFound.length, 0, 'some searchables were not compiled ' + JSON.stringify(notFound, null, 2));
        return scope;
      });
  }
}


function filterNotIncluded(source, target) {
  // console.log('source', source);
  // console.log('target', target);
  return source.filter(function(sourceComp) {
    return !target.filter(function(targetComp) {
      // compare
      if (sourceComp.id != targetComp._id) return false;
      if (sourceComp.name != targetComp._name) return false;
      return true;
    }).length > 0; // some items were found in the source that are not included in the target
  });
}
