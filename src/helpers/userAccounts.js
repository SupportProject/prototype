import {
  store
} from './../store'
import { db } from '../main'
import firebase from 'firebase'

export default {

  deleteAllUserDetails () {
    db.collection('users').get().then(res => {
      res.docs.forEach(doc => {
        db.collection('users').doc(doc.id).delete().then(del => {
          store.dispatch('updateAllUsers')
          console.log('Document ' + doc.id + ' successfully deleted')
        }).catch(err => {
          console.error('Error removing document: ' + doc.id, err)
        })
      })
    })
  },

  // note: unsecure, for prototyping only
  createUsersDetailsFromConfig () {
    // Iterate through seed accounts list and add them to users
    store.dispatch('accountSeeding', true)
    let seedAccounts = process.env.initUsers.seedAccounts
    let size = Object.keys(seedAccounts).length

    function loopSeedAccounts (count) {
      setTimeout(function () {
        console.log('Processing User ID: ', count)
        if (seedAccounts.hasOwnProperty(count)) {
          let email = seedAccounts[count].email
          let password = '123456'
          let name = seedAccounts[count].name
          let type = seedAccounts[count].type
          // check if account alredy exists in auth...
          // note it is possible to create a firebase service account
          // from https://firebase.google.com/docs/admin/setup and
          // retrieve users by email (admin.getUserByEmail) but for the moment
          // we can ensure we delete old users manually via the console.

          // so let's assume all old users have been deleted and create new users.
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(firebaseUser => {
            firebaseUser.updateProfile({
              displayName: name
            }).then(res => {
              console.log('Profile created for: ', email)
              let docData = {
                displayName: name,
                type: type,
                createdAt: Date.now()
              }
              db.collection('users').doc(firebaseUser.uid).set(docData)
              .then(res => {
                // Done
                console.log('User details created for: ', email)
                store.dispatch('registerAllUsers')
              })
            })
          })
        }
        if (++count <= (size - 1)) {
          loopSeedAccounts(count)
        } else {
          store.dispatch('accountSeeding', false)
        }
      }, 5000)
    }
    loopSeedAccounts(0)
  }
}
