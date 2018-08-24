export default {
  appTitle: '... Prototype',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH'
  },
  error: null,
  loading: false,
  accountSeedingLoading: false,
  user: {
    loggedIn: false,
    displayName: null,
    email: null,
    uid: null
  },
  userDetails: {
    displayName: null,
    ethAccount: null,
    ethBalance: null,
    walletCoupons: []
  },
  web3: {
    host: null,
    coinbase: null,
    networkId: null,
    networkType: null,
    currentProvider: null,
    latestBlock: {}
  },
  ganacheAccounts: [],
  allUsers: [],
  txComposer: [],
  userTxs: [],
  userTxsLatestBlock: 0,
  defaultContractAddresses: [
],
  contracts: [],
  notificationsQueue: [],
  userOpportunities: [],
  currencyConversionRates: {
    ethusd: '700',
    ethgbp: '523'
  }
}
