<template>
<v-container fluid>
  <v-layout row wrap>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2 class="text-xs-left" mt-3>
      <p class="body-2">System Settings:</p>
    </v-flex>
  </v-layout>
  <v-layout row wrap>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
      <v-expansion-panel focusable>
        <v-expansion-panel-content>
          <div slot="header">Blockchain</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <v-list two-line subheader>
                <v-subheader>Ethereum Blockchain Connections</v-subheader>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>Current Provider:</v-list-tile-title>
                    <v-list-tile-sub-title v-for="item in provider" :key="item.id">
                      {{ item.title }}: {{ item.value }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>Latest Block</v-list-tile-title>
                    <v-list-tile-sub-title v-for="item in latestBlock" :key="item.id">
                      {{ item.title }}: {{ item.value }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>Network</v-list-tile-title>
                    <v-list-tile-sub-title v-for="item in network" :key="item.id">
                      {{ item.title }}: {{ item.value }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Firebase</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <v-list two-line subheader>
                <v-subheader>{{ firebaseStatus }}</v-subheader>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Accounts</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <v-list two-line subheader>
                <v-subheader>Accounts Created and Assigned</v-subheader>
                <v-list-tile v-for="item in accountsStatus" :key="item.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.account }}</v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.user" class="deep-purple--text">
                      <v-icon class="green--text">check</v-icon> {{ item.user }}
                    </v-list-tile-sub-title>
                    <v-list-tile-sub-title v-else>
                      unassigned
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <v-divider></v-divider>
              <v-list one-line subheader>
                <v-subheader>Actions</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-btn color="warning" @click="deleteUserAccountsData">
                      <v-icon left>refresh</v-icon>
                      Delete User Accounts Data
                    </v-btn>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-btn color="success" @click="seedUserAccountsData" :disabled="accountSeedingLoading">
                      <v-icon left>refresh</v-icon>
                      Seed User Accounts Data
                    </v-btn>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-progress-circular indeterminate color="green" v-show="accountSeedingLoading"></v-progress-circular>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-btn color="warning" @click="deleteAllUserWalletData">
                      <v-icon left>refresh</v-icon>
                      Clear All User Wallet Data
                    </v-btn>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content>
          <div slot="header">Contracts</div>
          <v-card>
            <v-card-text class="grey lighten-3">
              <v-list two-line subheader>
                <v-subheader>Contracts Deployed</v-subheader>
                <v-list-tile v-for="item in contracts" :key="item.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    <v-list-tile-sub-title class="deep-purple--text">
                      <v-icon v-if="item.deployed" class="green--text">check</v-icon>
                      <v-icon v-else class="red--text">warning</v-icon>
                      {{ item.address }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import userAccounts from '../helpers/userAccounts'
export default {
  data () {
    return {
      //
    }
  },
  methods: {
    deleteUserAccountsData () {
      userAccounts.deleteAllUserDetails()
    },
    seedUserAccountsData () {
      userAccounts.createUsersDetailsFromConfig()
    },
    deleteAllUserWalletData () {
      userAccounts.deleteAllUserWalletDetails()
    }
  },
  computed: {
    provider () {
      return [{
        title: 'Current Provider',
        value: this.$store.state.web3.currentProvider || 'No current provider'
      },
      {
        title: 'Host Address',
        value: this.$store.state.web3.host || 'N/A'
      }]
    },
    latestBlock () {
      return [{
        title: 'Block Number',
        value: this.$store.state.web3.latestBlock.number || 'No blocks have been processed'
      },
      {
        title: 'Block Hash',
        value: this.$store.state.web3.latestBlock.hash || 'N/A'
      }]
    },
    network () {
      return [{
        title: 'Network ID',
        value: this.$store.state.web3.networkId || 'Not connected to network'
      },
      {
        title: 'Network Type',
        value: this.$store.state.web3.networkType || 'Not connected to network'
      }]
    },
    firebaseStatus () {
      return 'CONNECTED'
    },
    accountsStatus () {
      let usersByAccount = []
      let ganacheAccounts = []
      this.$store.getters.allUsers(false).forEach(res => {
        usersByAccount[res.ethAccount] = res.displayName
      })
      this.$store.state.ganacheAccounts.forEach(res => {
        ganacheAccounts.push({
          account: res,
          user: usersByAccount[res] ? usersByAccount[res] : ''
        })
      })
      return ganacheAccounts
    },
    accountSeedingLoading () {
      return this.$store.state.accountSeedingLoading
    },
    contracts () {
      let contractsDeployed = []
      let contracts = this.$store.state.contracts
      let defaultContractAddresses = this.$store.state.defaultContractAddresses
      defaultContractAddresses.forEach(res => {
        res.deployed = res.instance in contracts
        contractsDeployed.push(res)
      })
      return contractsDeployed
    }
  }
}
</script>
