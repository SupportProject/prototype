<template>
    <v-dialog v-model="dialog" :fullscreen="fullScreen" transition="dialog-bottom-transition" :overlay="false">
      <v-btn icon flat color="success" class="mx-0" slot="activator" @click="clickSend">
        <v-icon>swap_horiz</v-icon>
      </v-btn>
      <v-card>
        <v-toolbar dark color="success" @click.native="clickClose">
          <v-btn icon @click.native="clickClose" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>New Transaction: {{ currencyDetails.name }} ({{ currencyDetails.symbol }})</v-toolbar-title>
        </v-toolbar>
        <v-list two-line subheader>
          <v-subheader>From Account Details</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Account Owner</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-icon left>account_circle</v-icon>
                {{user.displayName}}
                <v-spacer></v-spacer>
                <v-icon left>email</v-icon>
                {{user. email}}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Account Address</v-list-tile-title>
              <v-list-tile-sub-title>{{userDetails.ethAccount}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Current Balance</v-list-tile-title>
              <v-list-tile-sub-title>
                <span v-if="currencyDetails.isToken">
                  {{ currencyDetails.userBalance }} {{ currencyDetails.symbol }}
                </span>
                <span v-else>
                {{balanceToEther}} {{currencyDetails.symbol}}
              </span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>

          <v-form v-model="valid" ref="form" lazy-validation>
            <v-list two-line subheader>
              <v-subheader>To Account Details</v-subheader>
              <v-list-tile>
                <v-list-tile-content>
                  <template>
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <app-user-selector @selected="onUserSelect" selectLabel="Select Recipient" userType="user"></app-user-selector>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </template>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile >
                <v-list-tile-content>
                  <template>
                    <v-container fluid>
                      <v-layout row wrap>
                        <v-flex xs12 sm6>
                          <v-text-field
                          label="Amount"
                          v-model="txAmount"
                          :rules="txAmountRules"
                          required
                          :suffix="currencyDetails.symbol"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </template>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-content>
                  <v-btn color="success" @click.native="submit">
                    Send Transaction
                    <v-icon right>swap_horiz</v-icon>
                  </v-btn>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import UserSelector from './sharedComponents/UserSelector.vue'
import transactionsHelper from '../helpers/transactions'

export default {
  data () {
    return {
      dialog: false,
      notifications: false,
      fullScreen: true, // todo detect screen size here and make true for sm screens
      valid: true,
      txAmount: null,
      txComposer: null,
      rules: false
    }
  },
  props: ['currencyDetails'],
  components: {
    'app-user-selector': UserSelector
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userDetails () {
      return this.$store.state.userDetails
    },
    balanceToEther () {
      return this.$store.getters.balanceToEther
    },
    txAmountRules () {
      if (!this.currencyDetails.isToken) {
        return [
          v => !!v || 'Amount is required',
          v => (!isNaN(parseFloat(v)) && isFinite(v) && v > 0) || 'Amount must be a valid number larger than zero',
          v => v <= Number(this.balanceToEther) || 'Insufficent funds' + '(Exceeds ' + this.balanceToEther + ' ETH)'
        ]
      } else {
        return [
          v => !!v || 'Amount is required',
          v => (!isNaN(parseFloat(v)) && isFinite(v) && v > 0) || 'Amount must be a valid number larger than zero',
          v => v <= Number(this.currencyDetails.userBalance) || 'Insufficent funds ' + '(Exceeds ' + this.currencyDetails.userBalance + ' ' + this.currencyDetails.symbol + ')'
        ]
      }
    }
  },
  methods: {
    onUserSelect (value) {
      if (value) {
        this.$store.dispatch('composeTransaction', {
          toAccount: value.account, toName: value.name
        })
      } else {
        this.$store.dispatch('composeTransaction', {
          toAccount: null, toName: null
        })
      }
    },
    clickSend () {
      // clear any pre-existing composed transactions
      this.$store.dispatch('composeTransaction', {})
      this.clear()
      // todo must also clear child component
    },
    clickClose () {
      // clear any pre-existing composed transactions and clear form
      this.$store.dispatch('composeTransaction', {})
      this.clear()
      this.dialog = false
      // todo must also clear child component
    },
    submit () {
      if (this.$refs.form.validate()) {

          let weiAmount = window.web3.utils.toWei(this.txAmount, 'ether')
          this.$store.dispatch('composeTransaction', {
            fromAddress: this.$store.state.userDetails.ethAccount,
            fromName: this.$store.state.user.displayName,
            toAddress: this.$store.state.txComposer.toAccount,
            toName: this.$store.state.txComposer.toName,
            amount: weiAmount
          })
          this.txComposer = this.$store.state.txComposer
          transactionsHelper.sendTransaction(this.txComposer)
          // clear screen
          this.dialog = false

      } else {
        console.log('validation failed')
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
