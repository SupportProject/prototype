<template>

        <v-select
          :label="selectLabel"
          :items="users"
          v-model="userSelector"
          item-text="account"
          item-value="[account, name]"
          max-height="auto"
          autocomplete
          clearable
          required
        >
          <template slot="selection" slot-scope="data">
            <v-list-tile-avatar>
              <img :src="data.item.profileImage" onerror="this.src='../../../static/profile/noImage.jpg'">
            </v-list-tile-avatar>
            {{ data.item.name }}, [{{ data.item.account.substring(0,10) + '........' +
            data.item.account.substr(data.item.account.length - 5) }}]
          </template>
          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-avatar>
                <img :src="data.item.profileImage" onerror="this.src='../../../static/profile/noImage.jpg'">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.account"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-select>

</template>

<script>
  export default {
    data () {
      return {
        valid: '',
        userSelector: []
      }
    },
    props: ['selectLabel', 'userType'],
    computed: {
      users () {
        let selections = [
          { header:
            'Select Account'
          }
        ]
        this.$store.getters.allUsers(true).forEach(res => {
          if (res.type === this.userType) {
            let path = '../../static/profile/'
            let filename = res.displayName
            filename = filename.split(' ').join('')
            let fileType = '.jpg'
            let profileImage = path + filename + fileType
            selections.push({name: res.displayName, account: res.ethAccount, profileImage: profileImage})
          }
        })
        return selections
      }
    },
    watch: {
      userSelector (value) {
        // todo this watcher now makes the component specific and not generic
        // perhaps better to use an event emitter to pass data back from child compenent to parent?
        if (value) {
          this.$emit('selected', {account: value.account, name: value.name})
        } else {
            //
        }
      }
    }
  }
</script>
