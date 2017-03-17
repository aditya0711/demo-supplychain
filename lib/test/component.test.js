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

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, id))
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
    const method = 'addSubComponent';
    const childArgs = {
      childAddress: undefined,
      quantity: child.quantity,
    };

    // call add() and test if it worked
    rest.setScope(scope)
      .then(createComponent(adminName, adminPassword, child.id, child.name))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        return scope;
      })
      .then(createComponent(adminName, adminPassword, parent.id, parent.name))
      .then(rest.callMethod(adminName, contractName, method, childArgs))
      .then(function(scope) {
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, 'addSubComponent should return ' + ErrorCodesEnum[ErrorCodesEnum.SUCCESS]);
        return scope;
      })
      .then(rest.getState(contractName))
      .then(function(scope) {
        const result = scope.states[contractName];
        const child1 = result.children[1];
        console.log(child1);
        const id32Fixed = util.fixBytes(child1.id32);

        assert.equal(child1.adrs, childArgs.childAddress, 'address');
        assert.equal(id32Fixed, util.toBytes32(child.id), 'id32');
        assert.equal(child1.quantity, child.quantity, 'quantity');

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
      .then(createComponent(adminName, adminPassword, child.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = child.quantity;
        return scope;
      })
      // create parent
      .then(createComponent(adminName, adminPassword, parent.id))
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
      .then(createComponent(adminName, adminPassword, child.id))
      .then(function(scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = child.quantity;
        return scope;
      })
      // create parent
      .then(createComponent(adminName, adminPassword, parent.id))
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
      .then(createComponent(adminName, adminPassword, parent.id))
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

  it.only('query', function(done) {

    const parent = {
      id: util.uid('ID'),
    };

    // create all component names
    var count = 5;
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
          return (createComponent(adminName, adminPassword, parent.id, parent.name)(scope)); // add component
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
        compArray.push({id: 'ID_666'});
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

function createComponent(adminName, adminPassword, id) {
  return function(scope) {
    rest.verbose('createComponent', id);

    const args = {
      id: id,
      id32: util.toBytes32(id),
    };

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args));
  }
}

function addSubComponent(adminName, childArgs) {
  return function(scope) {
    rest.verbose('addSubComponent', childArgs);

    // function addSubComponent(address childAddress, uint quantity) returns (ErrorCodesEnum)
    const method = 'addSubComponent';
    return rest.callMethod(adminName, contractName, method, childArgs)(scope);
  }
}

function addSubComponentTest(adminName, childArgs, expected) {
  return function(scope) {
    rest.verbose('addSubComponentTest', expected);

    return rest.setScope(scope)
      .then(addSubComponent(adminName, childArgs))
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
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', compiled, notFound);
        // if found any items in the searchable list, that are not included in the compile list results
        assert.equal(notFound.length, 0, 'some searchables were not compiled ' + JSON.stringify(notFound, null, 2));
        return scope;
      });
  }
}


function filterNotIncluded(source, target) {
  console.log('source', source);
  console.log('target', target);
  return source.filter(function(sourceComp) {
    return !target.filter(function(targetComp) {
      // compare
      if (sourceComp.id != targetComp._id) return false;
      return true;
    }).length > 0; // some items were found in the source that are not included in the target
  });
}
