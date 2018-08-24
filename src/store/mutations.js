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
  setWeb3 (state, payload) {
    for (var key in payload) {
      state.web3[key] = payload[key]
    }
  },
  setGanacheAccounts (state, payload) {
    state.ganacheAccounts = payload
  },
  setAllUsers (state) {
    db.collection('users').get().then(res => {
      let allUsers = []
      res.docs.forEach(doc => {
        let ethAccount = doc.data().ethAccount
        let displayName = doc.data().displayName
        let type = doc.data().type
        allUsers.push({ethAccount: ethAccount, displayName: displayName, type: type})
        if (allUsers.length === res.docs.length) {
          state.allUsers = allUsers
        }
      })
    })
  },
  resetAllUsers (state) {
    state.allUsers = []
  },
  setTxComposer (state, payload) {
    state.txComposer = payload
  },
  setUserTxsBlockUpdate (state, payload) {
    state.userTxsLatestBlock = payload
  },
  setUserTxs (state, payload) {
    state.userTxs = payload
  },
  setContracts (state, payload) {
    state.contracts = payload
  }
}
