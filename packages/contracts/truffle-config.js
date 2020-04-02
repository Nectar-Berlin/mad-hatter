/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');

const { XDAI_MNEMONIC } = process.env;

module.exports = {
  // Configure your compilers
  compilers: {
    solc: {
      version: '0.5.16',
      settings: {
        optimizer: {
          enabled: true,
          runs: 100,
        },
      },
    },
  },
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // match any network
    },
    xdai: {
      provider: () => new HDWalletProvider(
        XDAI_MNEMONIC, 'https://xdai.poanetwork.dev/', 0, 2,
      ),
      network_id: '100',
      // hard gas limit
      // gas: 6500000,
      // gasPrice: 1000000000 // Specified in Wei
    },

  }
}