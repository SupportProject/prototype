import helperUsers from '../helpers/userAccounts'

export default {
  getNotification: state => {
    let notificationsQueue = state.notificationsQueue
    console.log('Queue: ', notificationsQueue)
    if (notificationsQueue.length > 0) {
      return notificationsQueue.shift()
    }
    return false
  },
  isAuthenticated: state => {
    return state.user.loggedIn !== null &&
    state.user.loggedIn !== undefined &&
    state.user.loggedIn !== false
  },
  balanceToEther: state => {
    if (state.userDetails.ethBalance === null) {
      return null
    }
    return Number(window.web3.utils.fromWei(state.userDetails.ethBalance.toString(), 'ether'))
  },
  allUsers: (state) => (excludeLoggedinUser = false) => {
    let allUsers = state.allUsers
    if (excludeLoggedinUser) {
      allUsers = allUsers.filter(x => x.ethAccount !== state.userDetails.ethAccount)
    }
    return allUsers
  },

  userTxs: state => {
    // arrange allUsers by addresses
    let usersByAccount = []
    state.allUsers.forEach(res => {
      usersByAccount[res.ethAccount] = res
    })

    let userTxs = []
    let ethAccount = state.userDetails.ethAccount
    state.userTxs.forEach(tx => {
      let amount = window.web3.utils.fromWei(tx.value, 'ether')
      if (tx.from === ethAccount) {
        amount = -amount
      }

      let fees = 0
      if (tx.from === ethAccount) {
        fees = -window.web3.utils.fromWei((tx.gasUsed * Number(tx.gasPrice)).toString(), 'ether')
      }

      // If the transaction is with a contract, it won't relate to a user name
      let name = 'N/A'
      let otherParty = (tx.from === ethAccount ? tx.to : tx.from)
      if (otherParty in usersByAccount) {
        name = usersByAccount[otherParty].displayName
      }

      userTxs.push({
        value: false,
        name: name,
        address: otherParty,
        amount: Number(amount),
        fees: Number(fees),
        block: tx.blockNumber,
        blockHash: tx.blockHash,
        txHash: tx.hash,
        balance: Number(window.web3.utils.fromWei(tx.balance, 'ether'))
      })
    })
    return userTxs.reverse()
  },

  currencyConverter: (state) => (inputValue, conversionKey, reversedConversion = false) => {
    let conversion = ''
    if (reversedConversion) {
      conversion = (1 / Number(state.currencyConversionRates[conversionKey])) * Number(inputValue)
    } else {
      conversion = Number(state.currencyConversionRates[conversionKey]) * Number(inputValue)
    }
    return conversion.toString()
  }

}
