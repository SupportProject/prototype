import { db } from '../main'

export default {
  setNotification (state, payload) {
    state.notificationsQueue = payload
  },
  setUser (state, payload) {
    state.user = payload
  },
  setUserDetails (state, payload) {
    // state.user = payload
    for (var key in payload) {
      state.userDetails[key] = payload[key]
    }
  },
  setError (state, payload) {
    state.error = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setAccountSeedingLoading (state, payload) {
    state.accountSeedingLoading = payload
  },
  setAllUsers (state) {
    db.collection('users').get().then(res => {
      let allUsers = []
      res.docs.forEach(doc => {
        let displayName = doc.data().displayName
        let type = doc.data().type
        allUsers.push({displayName: displayName, type: type})
        if (allUsers.length === res.docs.length) {
          state.allUsers = allUsers
        }
      })
    })
  },
  resetAllUsers (state) {
    state.allUsers = []
  },
  setUserTxs (state, payload) {
    state.userTxs = payload
  }
}
