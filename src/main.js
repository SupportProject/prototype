// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import firebase from 'firebase'
import Web3 from 'web3'

import 'firebase/firestore'

Vue.use(Vuetify, {
  theme: {
    primary: '#F44336',
    secondary: '#E57373'
  }
})

// create a firebase account  (including Auth )at https://firebase.google.com/
// and set config details below
// configs are set in config folder
firebase.initializeApp({
  apiKey: process.env.firebase.apiKey,
  authDomain: process.env.firebase.authDomain,
  databaseURL: process.env.firebase.databaseURL,
  projectId: process.env.firebase.projectId
})

export const db = firebase.firestore()

Vue.config.productionTip = false

/* eslint-disable no-new */
const unsubscribe = firebase.auth()
  .onAuthStateChanged((firebaseUser) => {
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App),
      created () {
        // Create a web3 instance.
        if (process.env.web3.injectedProvider === true && typeof web3 !== 'undefined') {
          window.web3 = new Web3(window.web3.currentProvider)
          console.log(`Web3 Injected Provider: ${window.web3.currentProvider.constructor.name}`)
        } else {
          window.web3 = new Web3(new Web3.providers.HttpProvider(process.env.web3.localProviderUrl))
          console.log(`Web3 HTTP Provider: ${window.web3._provider.host} (Not using injected web3 such as Metamask)`)
        }
        // store.dispatch('registerCoinbase', window.web3)
        store.dispatch('registerWeb3', window.web3)
        // store.dispatch('resetAuctionContracts')
        store.dispatch('registerGanacheAccounts')
        store.dispatch('registerAllUsers')
        if (firebaseUser) {
          store.dispatch('autoSignIn', firebaseUser)
          store.dispatch('registerUserOpportunities')
        }
        store.dispatch('registerContracts')
      }
    })
    unsubscribe()
  })
