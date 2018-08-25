// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import firebase from 'firebase'

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
        store.dispatch('registerAllUsers')
        if (firebaseUser) {
          store.dispatch('autoSignIn', firebaseUser)
        }
      }
    })
    unsubscribe()
  })
