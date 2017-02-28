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

const componentManager = require('../componentManager');

const ErrorCodesEnum = rest.getEnums(`${config.contractsPath}/enums/ErrorCodes.sol`).ErrorCodesEnum;
const adminName = util.uid('Admin');
const adminPassword = '1234';
const contractName = 'ComponentManager';
const contractFilename = config.contractsPath + '/component/ComponentManager.sol';

describe('ComponentManager tests', function() {
  this.timeout(config.timeout * 1000);

  const scope = {};

  // upload the component-manager contract
  before(function(done) {
    rest.setScope(scope)
      .then(componentManager.compileSearch())
      .then(rest.createUser(adminName, adminPassword))
      .then(rest.getContractString(contractName, contractFilename))
      .then(rest.uploadContract(adminName, adminPassword, contractName))
      .then(function(scope) {
        done();
      }).catch(done);
  });

  for (var i = 0; i < 1000; i++) {
    it.only('create batch components', function(done) {

      const uid = util.uid();
      const parent = {
        id: `id_${uid}`,
        name: `name_${uid}`,
      };

      const count = 200;

      rest.setScope(scope)
        // add all components
        .then(createBatchComponent(adminName, parent.id, parent.name, count))
        .then(rest.waitQuery(`Component?_name=like.%${parent.name}%`, count))
        .then(rest.getState(contractName))
        .then(function(scope) {
          done();
        }).catch(done);
    });
  }

});

function factoryBatchCreateComponent(address, id, name, count) {
  const txs = [];
  for (var i = 0; i < count; i++) {
    const indexedId = id + '_' + i;
    txs.push({
      'contractName': contractName,
      'contractAddress': address,
      'methodName': 'createComponent',
      'value': 0.01,
      'args': {
        id: `${id}_${i}`,
        id32: util.toBytes32(`${id}_${i}`),
        name: `${name}_${i}`,
      },
    });
  }
  return txs;
}

function createBatchComponent(adminName, id, name, count) {
  return function(scope) {
    rest.verbose('createBatchComponent', id, name, count);
    const address = scope.contracts[contractName].address;
    const txs = factoryBatchCreateComponent(address, id, name, count);
    const txresolve = true;
    const method = 'createComponent';

    const transformer = function(returnValue) {
      return returnValue.value;
    }

    return rest.setScope(scope)
      .then(rest.callMethodList(adminName, txs, txresolve))
      .then(function(scope) {
        const batchResults = scope.tx.slice(-1)[0];
        const returnCodes = util.getBatchReturnValues(batchResults.result, transformer);
        const executedTxs = batchResults.params.txs;
        // filter the failed txs
        const failedTxs = executedTxs.map(function(tx, index) {
          // save the error code in the tx
          tx.error = ErrorCodesEnum[returnCodes[index]];
          return tx;
        }).filter(function(tx, index) {
          if (returnCodes[index] != ErrorCodesEnum.SUCCESS) {
            return true;
          }
        });
        assert.equal(failedTxs.length, 0, 'some txs failed ' + JSON.stringify(failedTxs, null, 2));
        return scope;
      });
  }
}
