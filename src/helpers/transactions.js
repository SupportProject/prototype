import {
  store
} from './../store'

export default {
  isAddress (address) {
    return window.web3.utils.isAddress(address)
  },
  validateTx (tx) {
    let err = []
    if (!this.isAddress(tx.fromAddress)) {
      err.push({code: 'Bad From Address', message: 'Invalid sender account address'})
    }
    if (!this.isAddress(tx.toAddress)) {
      err.push({code: 'Bad To Address', message: 'Invalid recipent account address'})
    }

    // validate whether account is registered to a user on this system

    // validate Amount

    return !err ? true : err
  },
  sendTransaction (tx) {
    // validate
    let validTx = this.validateTx(tx)

    if (validTx.length > 0) {
      return validTx
    }
    // convert amount to wei
    // let weiAmount = window.web3.utils.toWei('tx.txAmount')
    let ethTx = {
      from: tx.fromAddress,
      to: tx.toAddress,
      value: tx.amount
    }
    return this._postTransactionToBlockchain(ethTx)
  },
  _postTransactionToBlockchain (ethTx) {
    store.dispatch('newNotification', {
      title: 'New Transaction posted',
      type: 'success'
    })
    window.web3.eth.sendTransaction({
      from: ethTx.from,
      to: ethTx.to,
      value: ethTx.value
    })
    .on('transactionHash', hash => {
      console.log('hash', hash)
      store.dispatch('newNotification', {
        title: 'New transaction to process',
        text: hash,
        type: 'success'
      })
      store.dispatch('updateAccount')
    })
    .on('receipt', receipt => {
      console.log('reciept', receipt)
      store.dispatch('newNotification', {
        title: 'Transaction completed',
        type: 'success'
      })
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      console.log('confirmation Number:', confirmationNumber)
      console.log('reciept', receipt)
    })
    .on('error', error => {
      store.dispatch('newNotification', {
        title: 'Transaction Failed',
        text: error,
        type: 'error'
      })
    }) // If a out of gas error, the second parameter is the receipt.
  }
}
