# Fether

A blockchain web application based on Ethereum for creating and contributing to fundraisers.
The contract is deployed on a Rinkeby test network and requires **MetaMask** to be installed in order to ineteract with it.

## Deployment

Application is deployed using Vercel on https://fether.vercel.app/

## Development stack

Languages

- Solidity
- Typescript
- Javascript

Testing

- Waffle
- Mocha
- Chai

Ethereum portal

- Ethers.js

Task runner and testing network

- Hardhat

Frontend

- React
- Next

## Run the application on Your machine

Create two seperate config files (.env) in root and frontend directory.

Root config file contents

- `INFURA_API_KEY=""`
- `RINKEBY_PRIVATE_KEY=""`
- `ETHERSCAN_API_KEY=""`

Frontend config file contents

- `DEPLOYED_CONTRACT_ADDRESS=""`
- `INFURA_API_KEY=""`

### Quick start

- Clone the repository
  `git clone https://github.com/dudakovict/Fether.git`
- Switch directory
  `cd fether`
- Install dependencies
  `npm install`
- Build project
  `npm run build`
- Run tests
  `npm run test`
- Deploy contract and manually save the address in a config file
  `npm run deploy`
- Switch to frontend
  `cd frontend`
- Install dependencies
  `npm install`
- Run the application
  `npm run dev`

![Index page](https://github.com/dudakovict/Fether/tree/main/images/index.png?raw=true)
![Create fundraiser page](https://github.com/dudakovict/Fether/tree/main/images/create.png?raw=true)
![Fundraiser page](https://github.com/dudakovict/Fether/tree/main/images/fundraiser.png?raw=true)
![Reqeusts page](https://github.com/dudakovict/Fether/tree/main/images/requests.png?raw=true)
