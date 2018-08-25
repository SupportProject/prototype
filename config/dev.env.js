// For env configuration
// Any changes must be complied to take effect (npm run dev)
// Example usage within project: process.env.firebase.apiKey

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// Note: string variables need to be wrapped into single and double quotes '"..."'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  firebase: {
    apiKey: '"AIzaSyAFtw8zsWhYQK4AKl5HjVHxnrDmAiYxW1c"',
    authDomain: '"vue-eth-base.firebaseapp.com"',
    databaseURL: '"https://vue-eth-base.firebaseio.com"',
    projectId: '"vue-eth-base"'
  },

  web3: {
    // default to an injected provider (e.g. Metamask) if available
    injectedProvider: false,
    // use ganach-cli as a dev ethereum blockchain
    localProviderUrl: '"http://localhost:8545"'
  },

  // settings for the ganache-cli test ethereum networks
  // use these settings to start ganache with a consistent set of accounts
  ganache: {
    // option to seed accounts/mnemonic - ganache-cli -s "MyArbitrarySeed"
    seed: '"SeedPhraseHere"',
    // mnemonic option (also used in Metamask) - ganache-cli -m "... ... ..."
    mnemonic: '"MnemonicHere"',
    // the number of accounts to create - ganache-cli -a 10
    initAccounts: '20'
  },

  // Users to be initialised upon request and assigned an ethereum address
  initUsers: {
    // Admin
    seedAccounts: [{
        id: '0',
        name: '"Admin"',
        type: '"admin"',
        email: '"admin@test.proto"'
      },
      // Users - a List of initial users
      {
        id: '1',
        name: '"Homer Simpson"',
        type: '"user"',
        email: '"homer@test.proto"'
      },
      {
        id: '2',
        name: '"Donald Trump"',
        type: '"user"',
        email: '"donald@test.proto"'
      },
      {
        id: '3',
        name: '"Vladimir Putin"',
        type: '"user"',
        email: '"vladimir@test.proto"'
      },
      {
        id: '4',
        name: '"Victoria Beckham"',
        type: '"user"',
        email: '"victoria@test.proto"'
      },
      {
        id: '5',
        name: '"Kim Kardashian"',
        type: '"user"',
        email: '"kim@test.proto"'
      },
      {
        id: '6',
        name: '"Charlie Chaplin"',
        type: '"user"',
        email: '"charlie@test.proto"'
      }
    ]
  }
})
