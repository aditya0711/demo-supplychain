/**
 * Created by aditya on 3/23/17.
 */
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
const libPath = './lib';
const ms = require(`${path.join(process.cwd(), libPath)}/demoapp`)(config.contractsPath); // FIXME move to package

chai.use(chaiHttp);

function assert_noerr(err) {
    assert.equal(err, null, JSON.stringify(err, null, 2));
}

function assert_apiError(res, status, mustContain) {
    res.should.be.json;
    assert.notStrictEqual(res.body.success, undefined, 'Malformed body: success undefined');
    assert.notOk(res.body.success, `API success should be false: ${JSON.stringify(res.body, null, 2)}`);
    assert.equal(res.status, status, `HTTP status should be ${status} ${JSON.stringify(res.body.error)}`);
    assert.notStrictEqual(res.body.error, undefined, 'Malformed body: error undefined');
    const message = res.body.error.toLowerCase();
    assert.isAtLeast(message.indexOf(mustContain.toLowerCase()), 0, `error '${message}' must contain '${mustContain}' `);
}

function assert_apiSuccess(res) {
    res.should.be.json;
    assert.notStrictEqual(res.body.success, undefined, 'Malformed body: success undefined');
    assert.ok(res.body.success, `API success should be true ${JSON.stringify(res.body, null, 2)}`);
    assert.equal(res.status, 200, `HTTP status should be 200`);
    assert.strictEqual(res.body.error, undefined, `Error should be undefined `);
}

describe('Product REST API', function() {

    const userName = util.uid('User');
    const userPassword = "1234";

    before(function (done) {
        this.timeout(config.timeout);
        chai.request(server)
            .post(`/api/v1/users/${userName}`)
            .send({
                'password': userPassword
            })
            .end((err, res) => {
                assert_noerr(err);
                assert_apiSuccess(res);
                done();
            });
    });

    it('Should POST a new product', function(done){
        const productId = util.uid('ProductId');
        const name = util.uid('ProductName');
        const price = 100;

        this.timeout(config.timeout);
        chai.request(server)
            .post('/api/v1/product/createProduct')
            .send({
                'id': productId,
                'name': name,
                'price': price,
            })
            .end((err, res) => {
                assert_noerr(err);
                assert_apiSuccess(res);
                console.log("DATA: " + (res) )
                done();
            });
    })
})