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
    it('should create a product', function (done) {
        this.timeout(config.timeout);
        var product = {
            id: util.uid('ProductID'),
            name: util.uid('ProductName'),
            price: 711
        }
        parentID = product.id;

        chai.request(server)
            .post('/api/v1/products/')
            .send({
                id: product.id,
                name: product.name,
                price: product.price
            })
            .end((err, res) => {
                assert.apiNoError(err, res);
                assert.apiSuccess(res);
                res.body.should.have.property('data');
                const data = res.body.data;
                done();
            })
    });
    it('should create a child product', function (done) {
        this.timeout(config.timeout);
        var product = {
            id: util.uid('ProductID'),
            name: util.uid('ProductName'),
            price: 711
        }
        childId = product.id;

        chai.request(server)
            .post('/api/v1/products/')
            .send({
                id: product.id,
                name: product.name,
                price: product.price
            })
            .end((err, res) => {
                assert.apiNoError(err, res);
                assert.apiSuccess(res);
                res.body.should.have.property('data');
                const data = res.body.data;
                done();
            })
    });

});

describe('should test linking sub product to Product', function(){

    var parentID, childId;

    //Create a Parent Product
    before(function(done){
        this.timeout(config.timeout);
        var product = {
            id: util.uid('ParentID'),
            name: util.uid('ParentName'),
            price: 711
        }
        parentID = product.id;

        chai.request(server)
            .post('/api/v1/products/')
            .send({
                id: product.id,
                name: product.name,
                price: product.price
            })
            .end((err, res) => {
                assert.apiNoError(err, res);
                assert.apiSuccess(res);
                res.body.should.have.property('data');
                const data = res.body.data;
                done();
            })
    });
    //Create the Child Product
    before(function(done){
        this.timeout(config.timeout);
        var product = {
            id: util.uid('ChildID'),
            name: util.uid('ChildName'),
            price: 711
        }
        childId = product.id;

        chai.request(server)
            .post('/api/v1/products/')
            .send({
                id: product.id,
                name: product.name,
                price: product.price
            })
            .end((err, res) => {
                assert.apiNoError(err, res);
                assert.apiSuccess(res);
                res.body.should.have.property('data');
                const data = res.body.data;
                done();
            })
    });

    it('should link a sub product with a product', function(done){
        this.timeout(config.timeout);
        var quantity = 1;

        chai.request(server)
            .post('/api/v1/products/link')
            .send({
                parentId      : parentID,
                childId       : childId,
                quantity      : quantity
            })
            .end((err, res) => {
                assert.apiNoError(err, res);
                assert.apiSuccess(res);
                res.body.should.have.property('data');
                const data = res.body.data;
                console.log("DATA: " + JSON.stringify(data))
                assert.equal(data[0], '1')
                assert.equal(data[1], true)
                done();
            })
    })
});
