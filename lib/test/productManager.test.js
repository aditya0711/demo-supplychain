const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const should = common.should;
const assert = common.assert;
const Promise = common.Promise;

const productManager = require('../productManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';

describe('ProductManager tests', function () {
  this.timeout(config.timeout);

  const scope = {};

  // upload the ProductManager contract
  before(function (done) {
    rest.setScope(scope)
    // create admin
      .then(rest.createUser(adminName, adminPassword))
      // upload ComponentManager
      .then(productManager.uploadContract(adminName, adminPassword))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('should create a product', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    rest.setScope(scope)
    // create component
      .then(productManager.createProduct(adminName, parent.id, parent.name, parent.price))
      // test creation - returns ErrorCodesEnum
      .then(function (scope) {
        assert.equal(scope.result, ErrorCodesEnum.SUCCESS, `should return ${ErrorCodesEnum[ErrorCodesEnum.SUCCESS]}`);
        return scope;
      })
      // get the state
      .then(productManager.getState())
      .then(function (scope) {
        const components = scope.result['components'];
        assert.equal(components.length, 2, 'should have added 1 component');
        return scope;
      })
      .then(rest.waitQuery(`Product?_id=eq.${parent.id}`, 1, 12 * 60 * 1000))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('check exists', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    rest.setScope(scope)
      .then(existsTest(adminName, parent.id, false))
      .then(createProductTest(adminName, parent.id, parent.name, parent.price, ErrorCodesEnum.SUCCESS))
      .then(existsTest(adminName, parent.id, true))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add duplicate id', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    rest.setScope(scope)
      .then(createProductTest(adminName, parent.id, parent.name, parent.price, ErrorCodesEnum.SUCCESS))
      .then(createProductTest(adminName, parent.id, parent.name, parent.price, ErrorCodesEnum.EXISTS))
      .then(function (scope) {
        done();
      }).catch(done);
  });

  it('add sub component', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'parentID_' + uid,
      name: 'parentName_' + uid,
      price: 1234,
    };
    const child = {
      id: 'childID_' + uid,
      name: 'childName_' + uid,
      price: 1234,
      quantity: 123,
    };

    rest.setScope(scope)
      .then(createProductTest(adminName, parent.id, parent.name, parent.price, ErrorCodesEnum.SUCCESS))
      .then(createProductTest(adminName, child.id, child.name, child.price, ErrorCodesEnum.SUCCESS))
      .then(rest.waitQuery(`Product?_id=eq.${parent.id}`, 1))
      .then(function (scope) {
        const result = scope.query.slice(-1)[0];
        const parent = result[0];
        const children = parent.children;
        assert.equal(children.length - 1, 0, 'no children yet');
        return scope;
      })
      .then(linkTest(adminName, parent.id, child.id, child.quantity, ErrorCodesEnum.SUCCESS))
      .then(rest.waitQuery(`Product?_id=eq.${parent.id}`, 1))
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

  it.only('get product', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    rest.setScope(scope)
      // create a product
      .then(createProductTest(adminName, parent.id, parent.name, parent.price, ErrorCodesEnum.SUCCESS))
      // get the product tree
      .then(productManager.getProductTree(parent.id))
      .then(function (scope) {
        const tree = scope.result;
        assert.equal(tree['_id'], parent.id, 'tree');
        return scope;
      })
      // get non-existing product
      .then(function (scope) {
        const invalid = 'INVALID_ID32';
        const NOT_FOUND = 'Not Found';
        return rest.setScope(scope)
          .then(productManager.getProductTree(invalid))
          // should not be found - if found - throw an error
          .then(function (scope) {
            scope.error = new Error(`Should throw a ${NOT_FOUND} error for ${invalid}`);
            return scope;
          })
          // was not found - as expected
          .catch(function(err) {
            // verify that 'Not Found' error thrown
            const index = err.toString().indexOf(NOT_FOUND);
            assert.isAbove(index, -1, `Should throw a ${NOT_FOUND} error. Instead got: ${err.toString()}`);
            return scope;
          });
      })
      .then(function (scope) {
        if (scope.error !== undefined) {
          const error = scope.error;
          scope.error = undefined;
          throw error;
        }
        done();
      }).catch(done);
  });


  it('add multi level', function (done) {
    const uid = util.uid();
    const parent = {
      id: 'ID_' + uid,
      name: 'Name_' + uid,
      price: 1234,
    };

    // create all component id
    const count = 5;
    const compArray = Array.apply(null, {
      length: count
    }).map(function (item, index) {
      return {
        id: parent.id + '_' + index,
        name: parent.name + '_' + index,
        price: parent.price,
      };
    });

    rest.setScope(scope)
    // add all components
      .then(function (scope) {
        return Promise.each(compArray, function (comp) { // for each component
          return rest.setScope(scope)
            .then(createProductTest(adminName, comp.id, comp.name, comp.price, ErrorCodesEnum.SUCCESS))
            .then(rest.waitQuery(`Product?_id=eq.${comp.id}`, 1))
        }).then(function () { // all done
          return scope;
        });
      })
      // verify all are added
      .then(rest.waitQuery(`Product?_id=like.%${parent.id}%`, count))
      // test link
      .then(linkTest(adminName, compArray[0].id, compArray[1].id, 1, ErrorCodesEnum.SUCCESS))
      .then(linkTest(adminName, compArray[1].id, compArray[2].id, 1, ErrorCodesEnum.SUCCESS))
      .then(linkTest(adminName, compArray[3].id, compArray[4].id, 1, ErrorCodesEnum.SUCCESS))
      .then(linkTest(adminName, compArray[4].id, compArray[2].id, 1, ErrorCodesEnum.SUCCESS))
      .then(linkTest(adminName, compArray[2].id, compArray[0].id, 1, ErrorCodesEnum.RECURSIVE))
      .then(linkTest(adminName, compArray[2].id, compArray[3].id, 1, ErrorCodesEnum.RECURSIVE))
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
      // get the product tree
      .then(productManager.getProductTree(compArray[0].id))
      .then(function (scope) {
        const tree = scope.result;
        assert.equal(tree['_id'], compArray[0].id, 'tree');
        assert.equal(tree['children'][0]['_id'], compArray[1].id, 'tree');
        assert.equal(tree['children'][0]['children'][0]['_id'], compArray[2].id, 'tree');
        return scope;
      })
      .then(function (scope) {
        done();
      }).catch(done);
  });
});

function createProductTest(adminName, id, name, price, expected) {
  return function (scope) {
    rest.verbose('createProductTest', expected);

    return rest.setScope(scope)
      .then(productManager.createProduct(adminName, id, name, price))
      .then(function (scope) {
        assert.equal(scope.result, expected, `should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}

function existsTest(adminName, id, expected) {
  return function (scope) {
    rest.verbose('existsTest', expected);

    return rest.setScope(scope)
      .then(productManager.exists(adminName, id))
      .then(function (scope) {
        assert.equal(scope.result, expected, 'product exist');
        return scope;
      });
  }
}

function linkTest(adminName, parentId, childId, quantity, expected) {
  return function (scope) {
    rest.verbose('linkTest', expected);

    return rest.setScope(scope)
      .then(productManager.link(adminName, parentId, childId, quantity))
      .then(function (scope) {
        assert.equal(scope.result, expected, `should return ${ErrorCodesEnum[expected]}`);
        return scope;
      });
  }
}

function hasChildTest(adminName, parentId, childId, expected) {
  return function (scope) {
    rest.verbose('hasChildTest', parentId, childId, expected);

    return rest.setScope(scope)
      .then(productManager.hasChild(adminName, parentId, childId))
      .then(function (scope) {
        assert.equal(scope.result[0], expected[0]);
        assert.equal(scope.result[1], expected[1]);
        return scope;
      });
  }
}
