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
    }
  },
  computed: {
    firebaseStatus () {
      return 'CONNECTED'
    },
    accountSeedingLoading () {
      return this.$store.state.accountSeedingLoading
    }
  }
}
</script>
