const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const ba = require('blockapps-rest');
const common = ba.common;
const should = ba.common.should;
const assert = ba.common.assert;
const expect = ba.common.expect;
const config = common.config;
const util = common.util;
const path = require('path');
const libPath = './dapp';
const dapp = require(`${path.join(process.cwd(), libPath)}/dapp`)(config.contractsPath); // FIXME move to package

chai.use(chaiHttp);

describe('Dapp routes', function () {
  const userName = util.uid('User');
  const userPassword = "1234";

  it('should get all product', function (done) {
    this.timeout(config.timeout);
    chai.request(server)
      .get('/api/v1/products')
      .end((err, res) => {
        assert.apiNoError(err, res);
        assert.apiSuccess(res);
        res.body.should.have.property('data');
        const data = res.body.data;
        done();
      });
  });
});
