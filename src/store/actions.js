import firebase from 'firebase'
import router from '@/router'
import { db } from '../main'
import userAccountsHelper from '../helpers/userAccounts'

export default {
  newNotification ({commit}, payload) {
    let notifications = this.state.notificationsQueue
    notifications.push(payload)
    commit('setNotification', notifications)
  },
  // Sign up and user account creation
  userSignUp ({commit}, payload) {
    commit('setLoading', true)
    commit('setUserTxsBlockUpdate', 0)
    commit('setUserTxs', [])
    commit('resetAuctionContracts')
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
        let ethAddress = userAccountsHelper.getUnusedEthAddress()
        let docData = {
          ethAccount: ethAddress,
          displayName: firebaseUser.displayName,
          type: 'user',
          createdAt: Date.now()
        }
        db.collection('users').doc(firebaseUser.uid).set(docData)
        .then(res => {
          db.collection('users').doc(firebaseUser.uid).get()
          .then(doc => {
            let ethAccount = doc.data().ethAccount
            commit('setUserDetails', {ethAccount: ethAccount})
            window.web3.eth.getBalance(ethAccount).then(
              res => commit('setUserDetails', {ethBalance: res})
            )
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
    commit('setUserTxsBlockUpdate', 0)
    commit('setUserTxs', [])
    commit('resetAuctionContracts')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {loggedIn: true, email: firebaseUser.email, displayName: firebaseUser.displayName, uid: firebaseUser.uid})
        commit('setUserDetails', {
          displayName: firebaseUser.displayName
        })
        db.collection('users').doc(firebaseUser.uid).get()
        .then(doc => {
          let ethAccount = doc.data().ethAccount
          let walletCoupons = doc.data().walletCoupons || []
          commit('setUserDetails', {ethAccount: ethAccount, walletCoupons: walletCoupons})
          window.web3.eth.getBalance(ethAccount).then(
            res => commit('setUserDetails', {ethBalance: res})
          )
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
    commit('setUserTxsBlockUpdate', 0)
    commit('setUserTxs', [])
    commit('resetAuctionContracts')
    commit('setUser', {loggedIn: true, email: firebaseUser.email, displayName: firebaseUser.displayName, uid: firebaseUser.uid})
    db.collection('users').doc(firebaseUser.uid).get()
    .then(doc => {
      let ethAccount = doc.data().ethAccount
      let walletCoupons = doc.data().walletCoupons || []
      if (ethAccount) {
        commit('setUserDetails', {ethAccount: ethAccount, walletCoupons: walletCoupons})
        window.web3.eth.getBalance(ethAccount).then(
          res => commit('setUserDetails', {ethBalance: res})
        )
      }
    })
    .catch(error => console.log('Error retrieving document: ', error))
    commit('setAllUsers')
  },

  // reset user stores upon signout
  userSignOut ({commit}) {
    firebase.auth().signOut()
    commit('setUser', {loggedIn: false, displayName: null, email: null})
    commit('setUserDetails', {displayName: null, ethAccount: null, ethBalance: null, walletCoupons: []})
    commit('setUserTxsBlockUpdate', 0)
    commit('setUserTxs', [])
    commit('resetAuctionContracts')
    router.push('/')
  },

  // register all details relating to the web3 API
  registerWeb3 ({commit}, payload) {
    // register the current provider
    commit('setWeb3', {currentProvider: payload.eth.currentProvider.constructor.name})

    // register the host address
    commit('setWeb3', {host: window.web3._provider.host})

    // register the coinbase
    payload.eth.getCoinbase()
    .then(res => {
      commit('setWeb3', {coinbase: res})
    })

    // register the latest block details
    payload.eth.getBlock('latest')
    .then(res => {
      commit('setWeb3', {latestBlock: res})
    })

    // register network ID
    payload.eth.net.getId()
    .then(res => {
      commit('setWeb3', {networkId: res})
    })

    // register network type
    payload.eth.net.getNetworkType()
    .then(res => {
      commit('setWeb3', {networkType: res})
    })
  },

  // create an array of all the ethereum accounts created by ganache initiaion
  registerGanacheAccounts ({commit}) {
    window.web3.eth.getAccounts().then(res => {
      commit('setGanacheAccounts', res)
    })
  },

  // get documents for all users from firbase and store in an array
  registerAllUsers ({commit}) {
    commit('setAllUsers')
  },

  updateAllUsers ({commit}) {
    commit('resetAllUsers')
    commit('setAllUsers')
  },

  // Compose Transactions
  composeTransaction ({commit}, payload) {
    commit('setTxComposer', payload)
  },

  // Update Eth Account e.g. after a transaction
  updateAccount ({commit}) {
    let ethAccount = this.state.userDetails.ethAccount
    if (ethAccount) {
      if (!window.web3.utils.isAddress(ethAccount)) {
        return false
      }
      window.web3.eth.getBalance(ethAccount).then(
        res => commit('setUserDetails', {ethBalance: res})
      )
    } else {
      console.log('No Eth Account Registered')
    }
  },

  updateWallet ({commit}) {
    db.collection('users').doc(this.state.user.uid).get()
    .then(doc => {
      let walletCoupons = doc.data().walletCoupons || []
      commit('setUserDetails', {walletCoupons: walletCoupons})
    })
  },

  accountSeeding ({commit}, payload) {
    commit('setAccountSeedingLoading', payload)
  },

  userTxs ({commit}) {
    let ethAccount = this.state.userDetails.ethAccount
    if (ethAccount) {
      let userTxsLatestBlock = this.state.userTxsLatestBlock
      let txs = this.state.userTxs
      if (txs.length === 0) {
        // @todo this is clearly wrong but gets round the problem of initial txs load.
        commit('setUserTxsBlockUpdate', 0)
        userTxsLatestBlock = 0
      }
      window.web3.eth.getBlockNumber()
      .then(n => {
        if (n > userTxsLatestBlock) {
          for (let bl = (userTxsLatestBlock + 1); bl <= n; bl++) {
            window.web3.eth.getBlock(bl, true)
            .then(block => {
              commit('setUserTxsBlockUpdate', bl)
              for (let tx = 0; tx < block.transactions.length; tx++) {
                let blockTx = block.transactions[tx]
                if (blockTx.to === ethAccount || blockTx.from === ethAccount) {
                  window.web3.eth.getBalance(ethAccount, blockTx.blockNumber)
                  .then(balance => {
                    blockTx.balance = balance
                    window.web3.eth.getTransactionReceipt(blockTx.hash)
                    .then(receipt => {
                      blockTx.gasUsed = receipt.gasUsed
                      txs.push(blockTx)
                      if (txs.length > this.state.userTxs.length) {
                        commit('setUserTxs', txs)
                      }
                    })
                  })
                }
              }
            })
          }
        }
      })
    } else {
      console.log('No Eth Account Found')
    }
  },

  // create an array of all the ethereum accounts created by ganache initiaion
  registerContracts ({commit}) {
    commit('setContracts', [])
    let abi = []
    let defaultContractAddresses = this.state.defaultContractAddresses
    defaultContractAddresses.forEach(res => {
      let contract = new window.web3.eth.Contract(abi[res.instance], res.address)
      window.web3.eth.getCode(res.address)
      .then(code => {
        if (code.length > 3) {
          let contracts = this.state.contracts
          contracts[res.instance] = contract
          console.log('Contract Registration: ' + res.name, contract)
          commit('setContracts', contracts)
        } else {
          console.log('FAILED Contract Registration: ' + res.name)
        }
      })
    })
  }

}
