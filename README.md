# BlockApps REST Demo App

## Project dependecies
* `node v5`
* `npm v3`
* `mocha version 2.5.3`
* `apidoc -g` Needs to be globally installed

## Project setup


### Installation
`npm i`

## Run React Application

Remove the build folder is present: rm -rf build/

react-scripts build

PORT=3001 react-scripts start

Navigate to http://localhost:3001 for the React Application.



### Deployment Charlie Style
* Open 2 terminals, `A` and `B` in the project root
* run `node server/server.js` in terminal `A`
* run `react-scripts start` in terminal `B`

App should now be working

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

Rewards API tests

`mocha server/api/v1/test`

## View API documentation
`http://localhost:3000/`

## Implemented
* create/upload Product user `/api/v1/product/` POST
* addSubProduct `/api/v1/product/subProduct` POST
* getProduct `/api/v1/product/:productID` GET
* getProducts `/api/v1/product/` GET
