<template>
  <v-app v-scroll="onScroll">
    <v-navigation-drawer
    :clipped="$vuetify.breakpoint.lgAndUp"
    v-model="sidebar"
    fixed
    app>
    <v-list dense>
      <template v-for="item in items">
        <v-layout
          v-if="item.heading"
          :key="item.heading"
          row
          align-center
        >
          <v-flex xs6>
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-flex>
          <v-flex xs6 class="text-xs-center">
            <a href="#!" class="body-2 black--text">EDIT</a>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon=""
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="(child, i) in item.children"
            :key="i"
            @click=""
          >
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ child.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text" @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    </v-navigation-drawer>

    <v-toolbar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    dark
    app
    fixed
    class="primary">
    <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
      <v-toolbar-side-icon @click.stop="sidebar = !sidebar"></v-toolbar-side-icon>
      <router-link to="/home" tag="span" style="cursor: pointer">
        <span class="hidden-sm-and-down">{{ appTitle }}</span>
      </router-link>
    </v-toolbar-title>
    <v-text-field
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="search"
      label="Search"
      class="hidden-sm-and-down"
    ></v-text-field>
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
      <v-list-tile :to="'/home'" @click="">
        <v-list-tile-title><v-icon left>home</v-icon> Home</v-list-tile-title>
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
      <v-spacer></v-spacer>
      <div>
        <span class="primary--text"><h3>#Vue App</h3></span>
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
      sidebar: null,
      items: [
        { icon: 'contacts', text: 'Contacts' },
        { icon: 'history', text: 'Frequently contacted' },
        { icon: 'content_copy', text: 'Duplicates' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'add', text: 'Create label' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' },
            { text: 'Print' },
            { text: 'Undo changes' },
            { text: 'Other contacts' }
          ]
        },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Send feedback' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Go to the old version' }
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
            { title: 'Home', path: '/home', icon: 'home' }
        ]
      } else {
        return [
          { title: 'Sign Up', path: '/signup', icon: 'account_circle' },
          { title: 'Sign In', path: '/signin', icon: 'lock_open' },
          { title: 'System', path: '/system', icon: 'settings' }
        ]
      }
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
    }
  },
  mounted: function () {
    //
  }
}
</script>
