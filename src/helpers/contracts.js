export default {
  // contractsStateObject is all of the contracts for a particular demo type
  // which we store in state
  getContractFromAddress (contractsStateArray, contractAddress) {
    let contractMatch = false
    contractsStateArray.forEach(res => {
      if (res.contractAddress === contractAddress) {
        contractMatch = res.contract
        // would be nice if javascript let you break from forEach in a clean way
      }
    })
    return contractMatch
  }
}
