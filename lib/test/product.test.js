const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'Product';
const contractFilename = config.contractsPath + '/component/Product.sol';

describe('Product', function () {
  this.timeout(config.timeout);

  const scope = {};

  before(function (done) {
    rest.setScope(scope)
      .then(rest.createUser(adminName, adminPassword))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('upload a contract with constructor args', function (done) {
    const uid = util.uid();
    const id = 'ID_' + uid;
    const name = 'NAME_' + uid;
    const price = 1234;

    // upload the contract with constructor args
    rest.setScope(scope)
      .then(createProduct(adminName, adminPassword, id, name, price))
      .then(rest.getState(contractName))
      .then(function (scope) {
        const result = scope.states[contractName];
        const id32Fixed = util.fixBytes(result._id32);

        assert.equal(result._id, id, 'id');
        assert.equal(id32Fixed, util.toBytes32(id), 'id32');
        assert.equal(result._name, name, 'name');
        assert.equal(result._price, price, 'price');
        return scope;
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add sub product', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
      name: 'parentName_' + uid,
      price: 1234,
    };
    const child = {
      id: 'childID_' + uid,
      name: 'childName_' + uid,
      price: 5678,
      quantity: 69,
    };

    // function addSubProduct(Product childAddress, uint quantity) returns (ErrorCodesEnum)
    const method = 'addSubProduct';
    const childArgs = {
      childAddress: undefined,
      quantity: child.quantity,
    };

    // call add() and test if it worked
    rest.setScope(scope)
      .then(createProduct(adminName, adminPassword, child.id, child.name, child.price))
      .then(function (scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        return scope;
      })
      .then(createProduct(adminName, adminPassword, parent.id, parent.name, parent.price))
      .then(rest.callMethod(adminName, contractName, method, childArgs))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls[method];
        assert.equal(result, ErrorCodesEnum.SUCCESS, 'addSubProduct should return ' + ErrorCodesEnum[ErrorCodesEnum.SUCCESS]);
        return scope;
      })
      .then(rest.getState(contractName))
      .then(function (scope) {
        const result = scope.states[contractName];
        const child1 = result.children[1];
        const id32Fixed = util.fixBytes(child1.id32);

        assert.equal(child1.adrs, childArgs.childAddress, 'address');
        assert.equal(id32Fixed, util.toBytes32(child.id), 'id32');
        assert.equal(child1.quantity, child.quantity, 'quantity');

        return scope;
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });


  it('check child exists', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
      name: 'parentName_' + uid,
      price: 1234,
    };
    const child = {
      id: 'childID_' + uid,
      name: 'childName_' + uid,
      price: 5678,
      quantity: 69,
    };
    const childArgs = {};

    // call exists() before and after add()
    rest.setScope(scope)
    // create child
      .then(createProduct(adminName, adminPassword, child.id, child.name, child.price))
      .then(function (scope) {
        childArgs.childAddress = scope.contracts[contractName].address;
        childArgs.quantity = child.quantity;
        return scope;
      })
      // create parent
      .then(createProduct(adminName, adminPassword, parent.id, parent.name, parent.price))
      .then(existsTest(adminName, child.id, false))
      .then(addSubProductTest(adminName, childArgs, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, child.id, true))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  //
  // it('add duplicate child', function(done) {
  //   const uid = util.uid();
  //   const parent = {
  //     id: 'parentID_' + uid,
  //   };
  //   const child = {
  //     id: 'childID_' + uid,
  //     quantity: 123,
  //   };
  //   const childArgs = {};
  //
  //   // add duplicate
  //   rest.setScope(scope)
  //     // create child
  //     .then(createComponent(adminName, adminPassword, child.id))
  //     .then(function(scope) {
  //       childArgs.childAddress = scope.contracts[contractName].address;
  //       childArgs.quantity = child.quantity;
  //       return scope;
  //     })
  //     // create parent
  //     .then(createComponent(adminName, adminPassword, parent.id))
  //     .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.SUCCESS))
  //     .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.EXISTS))
  //     .then(function(scope) {
  //       done();
  //     }).catch(done);
  // });
  //
  // it('add self as child', function(done) {
  //   const uid = util.uid();
  //   const parent = {
  //     id: 'parentID_' + uid,
  //   };
  //   const childArgs = {};
  //
  //   // add duplicate
  //   rest.setScope(scope)
  //     .then(createComponent(adminName, adminPassword, parent.id))
  //     .then(function(scope) {
  //       childArgs.childAddress = scope.contracts[contractName].address;
  //       childArgs.quantity = 456;
  //       return scope;
  //     })
  //     .then(addSubComponentTest(adminName, childArgs, ErrorCodesEnum.RECURSIVE))
  //     .then(function(scope) {
  //       done();
  //     }).catch(done);
  // });
  //
  // it('query', function(done) {
  //
  //   const parent = {
  //     id: util.uid('ID'),
  //   };
  //
  //   // create all component names
  //   const count = 5;
  //   const compArray = Array.apply(null, {
  //     length: count
  //   }).map(function(item, index) {
  //     return {
  //       id: parent.id + '_' + index,
  //     };
  //   });
  //
  //   rest.setScope(scope)
  //     // add all components
  //     .then(function(scope) {
  //       return Promise.each(compArray, function(parent) { // for each component
  //         return (createComponent(adminName, adminPassword, parent.id, parent.name)(scope)); // add component
  //       }).then(function() { // all done
  //         return scope;
  //       });
  //     })
  //     // query
  //     .then(rest.query('Component'))
  //     .then(function(scope) {
  //       const result = scope.query.slice(-1)[0];
  //       const notIncluded = filterNotIncluded(compArray, result);
  //       // if found any items in the source list, that are not included in the query results
  //       assert.equal(notIncluded.length, 0, 'some components were not created ' + JSON.stringify(notIncluded, null, 2));
  //       return scope;
  //     })
  //     // test the filter
  //     .then(function(scope) {
  //       compArray.push({id: 'ID_666'});
  //       const result = scope.query.slice(-1)[0];
  //       const notIncluded = filterNotIncluded(compArray, result);
  //       // should find 1 not included
  //       assert.equal(notIncluded.length, 1, 'the filter should find 1 exception');
  //       return scope;
  //     })
  //     .then(function(scope) {
  //       done();
  //     }).catch(done);
  // });

});

function createProduct(adminName, adminPassword, id, name, price) {
  return function (scope) {
    rest.verbose('createComponent', id);

    const args = {
      id: id,
      id32: util.toBytes32(id),
      name: name,
      price: price,
    };

    return rest.setScope(scope)
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName, args));
  }
}

function addSubProduct(adminName, childArgs) {
  return function (scope) {
    rest.verbose('addSubProduct', childArgs);

    // function addSubProduct(address childAddress, uint quantity) returns (ErrorCodesEnum)
    const method = 'addSubProduct';
    return rest.callMethod(adminName, contractName, method, childArgs)(scope);
  }
}

function addSubProductTest(adminName, childArgs, expected) {
  return function (scope) {
    rest.verbose('addSubProductTest', expected);

    return rest.setScope(scope)
      .then(addSubProduct(adminName, childArgs))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls['addSubProduct'];
        assert.equal(result, expected, 'addSubProduct should return ' + ErrorCodesEnum[expected]);
        return scope;
      });
  }
}

function exists(adminName, id) {
  return function (scope) {
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
  return function (scope) {
    rest.verbose('existsTest', expected);

    return rest.setScope(scope)
      .then(exists(adminName, id))
      .then(function (scope) {
        const result = scope.contracts[contractName].calls['exists'] == 'true';
        assert.equal(result, expected, 'child exist');
        return scope;
      });
  }
}