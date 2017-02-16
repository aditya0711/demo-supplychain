'use strict';
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;
const path = require('path');
const libPath = './lib';
const ms = require(`${path.join(process.cwd(), libPath)}/demoapp`)(config.contractsPath); // FIXME move to package

exports.create = function(req, res) {
    const deploy = req.app.get('deploy');
    const searchTerm = req.query.term;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getUsers(deploy.adminName, searchTerm))
        .then(function(scope) {
                util.response.status200(res, {users: scope.userList});
        })
        .catch(function(err) {
            util.response.status500(res, err);
        });
}

exports.getAllProducts = function(req, res) {
    const deploy = req.app.get('deploy');
    const searchTerm = req.query.term;

    ms.setScope()
        .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
        .then(ms.getUsers(deploy.adminName, searchTerm))
        .then(function(scope) {
            util.response.status200(res, {users: scope.userList});
        })
        .catch(function(err) {
            util.response.status500(res, err);
        });
}

// exports.generateQR = function(req, res) {
//     const deploy = req.app.get('deploy');
//     const searchTerm = req.query.term;
//
//     ms.setScope()
//         .then(ms.setAdmin(deploy.adminName, deploy.adminPassword, deploy.AdminInterface.address))
//         .then(ms.getUsers(deploy.adminName, searchTerm))
//         .then(function(scope){
//             util.response.status200(res, {users: scope.userList});
//         })
//         .catch(function(err){
//             util.response.status500(res, err);
//         });
// }