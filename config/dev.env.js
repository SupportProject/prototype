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
    apiKey: '"AIzaSyDkOL-53Nu7ty5kgGWttaKcpzAe2hDxwnA"',
    authDomain: '"supportproject-54ae6.firebaseapp.com"',
    databaseURL: '"https://supportproject-54ae6.firebaseio.com"',
    projectId: '"supportproject-54ae6"'
  },

  // Users to be initialised upon request
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
