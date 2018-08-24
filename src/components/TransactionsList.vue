<template>
  <v-card>
    <v-card-title>
      {{user.displayName}} <br/>
      {{userDetails.ethAccount}}

      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}<br/>{{ props.item.address.substring(0,11) + '...' || '' }}</td>
        <td class="text-xs-left" v-bind:class="{ 'red--text': props.item.amount < 0 }">{{ props.item.amount }} {{ currency.symbol }}</td>
        <td class="text-xs-left">{{ props.item.fees }} {{ currency.symbol }}</td>
        <td class="text-xs-left">{{ props.item.block }}</td>
        <td class="text-xs-left">{{ props.item.txHash.substring(0,11) + '...' }}</td>
        <td class="text-xs-left">{{ props.item.balance }} {{ currency.symbol }}</td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Amount', value: 'amount', sortable: false },
        { text: 'Fees', value: 'fees', sortable: false },
        { text: 'Block', value: 'block', sortable: false },
        { text: 'Tx Hash', value: 'txHash', sortable: false },
        { text: 'Block Balance', value: 'balance', sortable: false }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    userDetails () {
      return this.$store.state.userDetails
    },
    items () {
      return this.$store.getters.userTxs
    },
    currency () {
      return this.$store.state.currency
    }
  }
}
</script>
