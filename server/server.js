'use strict'
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const ba = require('blockapps-rest');
const rest = ba.rest;
const common = ba.common;
const config = common.config;
const util = common.util;
const fsutil = common.fsutil;

const deploy = fsutil.yamlSafeLoadSync(config.deployFilename, config.apiDebug);
console.log('Deploy:', deploy);
if (deploy === undefined) throw new Error('Deploy config.deployFilename not found ', config.deployFilename);

app.set('deploy', deploy);
/**
 * Config to handle POSTs to API
 *  - Parse JSON and URL encode
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Set static assets directory
 * for documentation
 */
app.use(express.static(path.join(__dirname, '../doc')));

/**
 * Set up API routes
 */
const routes = require('./routes');
app.use('/', routes);


// get the intended port number, use port 3000 if not provided
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) {
    console.log((err.message));
  } else {
    console.log('Example app listening on port 3000!');
  }
});

module.exports = app;
