# BlockApps REST Demo App

## Project dependecies
* `node v5`
* `npm v3`

## Project setup

### Installation
`npm i`

### Deployment

#### localhost

  `NODE=localhost npm run deploy`

#### remote

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

`npm run test-contracts`

Rewards API tests

`npm run test-api`

## View API documentation
`http://localhost:3000/`

## Implemented
* create user `/api/v1/users/:username`
* login `/api/v1/users/validate`
* get user history `/api/v1/users/history`
* get user balance `/api/v1/users/balance`
* reward user `/api/v1/users/reward`
* redeem user `/api/v1/users/redeem`
* revoke user `/api/v1/users/revoke`
* get store items `/api/v1/store`
* get store item by contract Address `/api/v1/store`
