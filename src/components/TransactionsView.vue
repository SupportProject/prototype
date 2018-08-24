<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" :fullscreen="fullScreen" transition="dialog-bottom-transition" :overlay="false">
      <v-btn icon flat color="info" class="mx-0" slot="activator" @click.native="viewTxs">
        <v-icon>receipt</v-icon>
      </v-btn>
      <v-card>
        <v-toolbar dark color="info" @click.native="clickClose">
          <v-btn icon @click.native="clickClose" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>View Transactions</v-toolbar-title>
        </v-toolbar>
        <app-transactions-list></app-transactions-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import TransactionsList from './TransactionsList.vue'

export default {
  data () {
    return {
      dialog: false,
      notifications: false,
      fullScreen: true // todo detect screen size here and make true for sm screens
    }
  },
  components: {
    'app-transactions-list': TransactionsList
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
    }
  },
  methods: {
    clickClose () {
      this.dialog = false
      // todo must also clear child component
    },
    viewTxs () {
      this.$store.dispatch('userTxs')
    }
  }
}
</script>
