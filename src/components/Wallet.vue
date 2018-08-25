<template>
<v-container fluid class="mb-5">
  <v-layout row wrap>
    <v-flex xs12 sm12 md8 offset-md2>
      <v-card>
        <v-card-media class="primary lighten-2 white--text" height="120px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12 sm6 align-end flexbox>
                <span class="headline"><v-icon dark left large>account_balance_wallet</v-icon> Wallet</span>
              </v-flex>
              <v-flex xs12 sm6 align-end flexbox>
                <div class="text-xs-right">
                  <v-avatar size="86px">
                    <img :src="profileImage" onerror="this.src='../../static/profile/noImage.jpg'">
                  </v-avatar>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-media>
        <v-container fluid>
          <v-card-text>
            <div id="ethereum-qr-code" class="text-xs-center"><canvas height="205" width="205" style="width: 180px;" class="blue-grey lighten-2"></canvas></div>
            <p class="text-xs-center"><strong>Account:</strong> {{ userDetails.ethAccount || '' }}</p>
            <template>
              <v-data-table
              :headers="headers"
              :items="currencies"
              hide-actions
              :loading="fetchingBalance"
              class="elevation-1"
              >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }} ({{ props.item.symbol }})
                  </td>
                  <td class="text-xs-center">{{ props.item.userBalance }}
                  </td>
                  <td class="text-xs-center">{{ props.item.eth }}</td>
                  <td class="text-xs-center">{{ props.item.gbp }}</td>
                  <td class="justify-center layout px-0">
                    <app-transaction-send
                    :currencyDetails="props.item"
                     v-if="props.item.isTransferable || (!props.item.isTransferable && props.item.userIsIssuer)"
                    ></app-transaction-send>
                    <div v-else>
                      <v-tooltip bottom>
                        <v-btn icon flat color="grey" class="mx-0" slot="activator" @click="">
                          <v-icon>swap_horiz</v-icon>
                        </v-btn>
                        <span>Non-Transferable</span>
                      </v-tooltip>
                    </div>
                    <app-transactions-view></app-transactions-view>
                  </td>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TransactionSend from './TransactionSend.vue'
import TransactionsView from './TransactionsView.vue'
import EthereumQRPlugin from 'ethereum-qr-code'
import Utils from './../helpers/utils'
import Axios from 'axios'

export default {
  data () {
    return {
      balance: null,
      fetchingEthAccount: true,
      fetchingBalance: false,
      qrCodeRendered: false,
      headers:
      [
        { text: 'Currency', align: 'left', sortable: false, value: 'currency' },
        { text: 'Balance', align: 'center', sortable: false, value: 'userBalance' },
        { text: 'ETH', align: 'center', sortable: false, value: 'eth' },
        { text: 'GBP', align: 'center', sortable: false, value: 'gbp' },
        { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
      ]
    }
  },
  components: {
    'app-transaction-send': TransactionSend,
    'app-transactions-view': TransactionsView
  },
  computed: {
    ...mapGetters({
      balanceToEther: 'balanceToEther'
    }),
    user () {
      return this.$store.state.user
    },
    userDetails () {
      return this.$store.state.userDetails
    },
    currency () {
      return this.$store.state.currency
    },
    currencies () {
      let allCurrencies = []
      allCurrencies.push(
        {
          value: false,
          name: 'Ether',
          userBalance: this.balanceToEther,
          eth: this.balanceToEther,
          gbp: '£' + Utils.currencyFormat(this.convert(this.balanceToEther, 'ethgbp')),
          actions: '',
          isToken: false,
          isPointsOnly: false,
          userIsIssuer: false,
          isTransferable: true,
          contractAddress: null,
          owner: '',
          symbol: 'ETH'
        })
      return allCurrencies
    },
    profileImage () {
      let path = '../../static/profile/'
      let filename = this.$store.state.user.displayName
      filename = filename.split(' ').join('')
      let fileType = '.jpg'
      return path + filename + fileType
    }
  },
  watch: {
    balanceToEther (value) {
      if (!this.fetchingBalance) {
        // balance has updated so show spinner
        this.fetchingBalance = true
        setTimeout(this.balanceUpdated, 800)
        return
      }
      if (value !== null) {
        this.fetchingBalance = false
      } else {
        this.fetchingBalance = true
      }
    }
  },
  methods: {
    convert (eth, conversionKey) {
      return this.$store.getters.currencyConverter(eth, conversionKey)
    },
    getEthereumPrice (source = 'local') {
      if (source === 'local') {
        return false
      }
      Axios.get('https://api.coinmarketcap.com/v2/ticker/1027', {
        headers: {'Access-Control-Allow-Origin': '*'},
        params: {
          convert: 'GBP'
        }
      })
      .then(function (response) {
        console.log('Ethereum Price', response)
      })
      .catch(function (error) {
        console.log(error)
      })
      /* Axios call doesn't work when calling from localhost due to CORS problem
      CROSS ORIGIN RESOURCE SHARING.  Solutions from this post
      https://github.com/axios/axios/issues/853 suggest either having a proxy
      server or altering the webpack config.  In the meantime I will user a state
      variable to approxiate the Ethereum price. */
    },
    createQRCode () {
      if (this.userDetails.ethAccount && !this.qrCodeRendered) {
        const qr = new EthereumQRPlugin()
        const sendDetails = {
          to: this.userDetails.ethAccount
        }
        const configDetails = {
          size: 180,
          selector: '#ethereum-qr-code',
          options: {
            margin: 2
          }
        }
        qr.toCanvas(sendDetails, configDetails)
        this.qrCodeRendered = true
      }
    },
    balanceUpdated () {
      this.fetchingBalance = false
      this.createQRCode()
    },
    checkBalance () {
      this.$store.dispatch('updateAccount')
    }
  },
  mounted: function () {
    this.fetchingBalance = true
    setTimeout(this.balanceUpdated, 1600)
    this.checkBalance()
    this.getEthereumPrice()
  }
}
</script>
