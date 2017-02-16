# BlockApps REST Demo App

## Project dependecies
* `node v5`
* `npm v3`
* `mocha version 2.5.3`
* `apidoc -g` Needs to be globally installed

## Project setup

### Installation

inside folder that contains `package.json`. 
`npm install` 
`npm update`
`react-scripts build`

`$NODE=bayar3 && npm start`

If `react-scripts build` is unavailable, install it globally with `sudo npm install -g react-scripts`.
The node application runs on port 3001, and React application runs on port 3000. However if `npm start` doesn't start both the React app and the Node app, open another terminal and run `react-scripts start`. 

### Deployment
* In the folder `./config`, create a config file for the target Blockapps server
* Name the file $YOUR_NODE$.config.yaml
* Do the same for $YOUR_NODE$.deploy.yaml
* Deploy to $YOUR_NODE$

  `NODE=$YOUR_NODE$ npm run deploy`

Now you are ready to run the API.

## Run the project locally

`npm start`

To run in the background run

`npm start:back`

## Run the tests

Smart contract tests

`mocha lib/test/`

## View API documentation
`http://localhost:3000/`

## Implemented

* add a new product `/api/v1/product/create`

