import firebase from 'firebase'
import router from '@/router'
import { db } from '../main'

export default {
  newNotification ({commit}, payload) {
    let notifications = this.state.notificationsQueue
    notifications.push(payload)
    commit('setNotification', notifications)
  },
  // Sign up and user account creation
  userSignUp ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(firebaseUser => {
      firebaseUser.updateProfile({
        displayName: payload.name
      }).then(res => {
        commit('setUser', {loggedIn: true, email: firebaseUser.email, displayName: firebaseUser.displayName, uid: firebaseUser.uid})
        commit('setAllUsers')
        commit('setUserDetails', {
          displayName: firebaseUser.displayName
        })
        let docData = {
          displayName: firebaseUser.displayName,
          type: 'user',
          createdAt: Date.now()
        }
        db.collection('users').doc(firebaseUser.uid).set(docData)
        .then(res => {
          db.collection('users').doc(firebaseUser.uid).get()
          .then(doc => {
          //
          })
          .catch(error => console.log('Error retrieving document: ', error))
        })
      })
      commit('setLoading', false)
      router.push('/home')
    })
    .catch(error => {
      commit('setError', error.message)
      commit('setLoading', false)
    })
  },

  // Sign in
  userSignIn ({commit}, payload) {
    commit('setLoading', true)
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {loggedIn: true, email: firebaseUser.email, displayName: firebaseUser.displayName, uid: firebaseUser.uid})
        commit('setUserDetails', {
          displayName: firebaseUser.displayName
        })
        db.collection('users').doc(firebaseUser.uid).get()
        .then(doc => {
          //
        })
        .catch(error => console.log('Error retrieving document: ', error))
        commit('setLoading', false)
        commit('setError', null)
        commit('setAllUsers')
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
  },

  // sign in upon browser refresh
  autoSignIn ({commit}, firebaseUser) {
    commit('setUser', {loggedIn: true, email: firebaseUser.email, displayName: firebaseUser.displayName, uid: firebaseUser.uid})
    db.collection('users').doc(firebaseUser.uid).get()
    .then(doc => {
      //
    })
    .catch(error => console.log('Error retrieving document: ', error))
    commit('setAllUsers')
  },

  // reset user stores upon signout
  userSignOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', {loggedIn: false, displayName: null, email: null})
    commit('setUserDetails', {displayName: null})
    router.push('/')
  },

  // get documents for all users from firbase and store in an array
  registerAllUsers ({commit}) {
    commit('setAllUsers')
  },

  updateAllUsers ({commit}) {
    commit('resetAllUsers')
    commit('setAllUsers')
  },

  accountSeeding ({commit}, payload) {
    commit('setAccountSeedingLoading', payload)
  }

}
