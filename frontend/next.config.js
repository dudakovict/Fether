require('dotenv').config();

module.exports = {
  env: {
    DEPLOYED_CONTRACT_ADDRESS: process.env.DEPLOYED_CONTRACT_ADDRESS,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
  },
};
