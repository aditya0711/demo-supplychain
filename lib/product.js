const ba = require('blockapps-rest');
const rest = ba.rest;
const util = ba.common.util;
const config = ba.common.config;

const contractName = 'Product';
const contractFilename = config.contractsPath + '/component/Product.sol';

function compileSearch() {
  return function(scope) {
    const searchable = [contractName];
    return rest.setScope(scope)
      .then(rest.compileSearch(searchable, contractName, contractFilename));
  }
}

module.exports = {
  compileSearch: compileSearch,
};
