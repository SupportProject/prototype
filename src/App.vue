<template>
  <v-app v-scroll="onScroll">
    <v-navigation-drawer v-model="sidebar" disable-resize-watcher app>
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="isAuthenticated" @click="userSignOut">
          <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
          <v-list-tile-content>Sign Out</v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark class="primary">
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>

      </span>
      <v-toolbar-title>
        <router-link to="/home" tag="span" style="cursor: pointer">
          <v-toolbar-items>
          <img src="./assets/logo.png" height="36" class="pr-2">
          <span>
           {{ appTitle }}
          </span>
           </v-toolbar-items>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">

  <v-btn v-if="!isAuthenticated"
    flat
    v-for="item in menuItems"
    :key="item.title"
    :to="item.path">
    {{ item.title }}
  </v-btn>

  <v-menu v-if="isAuthenticated">
    <v-btn flat dark slot="activator">
      <v-icon left>account_circle</v-icon>
      {{ user.displayName || ''}}
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile :to="'/wallet'" @click="">
        <v-list-tile-title><v-icon left>account_balance_wallet</v-icon> Wallet</v-list-tile-title>
      </v-list-tile>
      <v-list-tile @click="userSignOut">
        <v-list-tile-title><v-icon left>exit_to_app</v-icon> Sign Out</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>

</v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
      <v-footer class="mt-4 pa-3" fixed>

        <v-slide-y-reverse-transition>
        <span v-show="!blockchainLoading" >
          <v-chip label color="primary lighten-2" text-color="white" small>Latest Block:&nbsp;<strong>{{ latestBlock }}</strong></v-chip>
        </span>
        </v-slide-y-reverse-transition>

      <v-spacer></v-spacer>
      <div>
        <span class="primary--text"><h3>#Vue Ethereum App</h3></span>
      </div>
    </v-footer>

    <template>
      <v-card>
        <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          :bottom="true"
          :vertical="true"
          :value="notifications"
          >
        {{ notifications.title }}: <br/>
        {{ notifications.text }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<v-scale-transition>
  <v-btn v-show="showScroller" fab dark bottom right fixed small @click="$vuetify.goTo(0, {
    duration: 600,
    offset: 0,
    easing: 'easeInOutCubic'
    })" color="pink lighten-1 mb-4">
      <v-icon dark>keyboard_arrow_up</v-icon>
    </v-btn>
</v-scale-transition>

  </v-app>
</template>

<script>

export default {
  data () {
    return {
      snackbar: false,
      offsetTop: 0,
      blockchainLoading: false,
      sidebar: false,
      tools: [
      ],
      demos: [
      ]
    }
  },
  computed: {
    showScroller () {
      return this.offsetTop > 150
    },
    appTitle () {
      return this.$store.state.appTitle
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    menuItems () {
      if (this.isAuthenticated) {
        return [
            { title: 'Wallet', path: '/wallet', icon: 'account_balance_wallet' }
        ]
      } else {
        return [
          { title: 'Sign Up', path: '/signup', icon: 'account_circle' },
          { title: 'Sign In', path: '/signin', icon: 'lock_open' },
          { title: 'System', path: '/system', icon: 'settings' }
        ]
      }
    },
    latestBlock () {
      return this.$store.state.web3.latestBlock.number || 'No Network Detected'
    },
    notifications () {
      let notification = this.$store.getters.getNotification
      if (notification) {
        this.snackbar = true
        return {
          title: notification.title,
          text: notification.text,
          type: notification.type
        }
      }
      return false
    },
    user () {
      return this.$store.state.user
    },
    userDetails () {
      return this.$store.state.userDetails
    }
  },
  methods: {
    onScroll (e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },
    userSignOut () {
      this.$store.dispatch('userSignOut')
    },
    refreshBlockchainData () {
      this.$store.dispatch('registerWeb3', window.web3)
      .then(
       //
      )
    }
  },
  watch: {
    $route (to, from) {
      switch (to.path) {
        default:
          //
      }
      switch (from.path) {
        default:
          //
      }
      this.show = false
    },
    latestBlock: function (val) {
      this.blockchainLoading = true
      if (this.isAuthenticated && this.$route) {
        this.$store.dispatch('userTxs')
        this.$store.dispatch('updateAccount')
      }
      setTimeout(function () {
        this.blockchainLoading = false
      }.bind(this), 350)
    }
  },
  mounted: function () {
    // Poll blockchain for latest block
    this.refreshBlockchainData()
    setInterval(function () {
      this.refreshBlockchainData()
    }.bind(this), 6500)
  }
}
</script>
