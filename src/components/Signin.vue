    <template>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 sm8 md6 offset-sm2 offset-md3>
            <v-card>
              <v-container fluid>
              <v-flex xs12>
                  <v-card color="primary" class="white--text">
                    <v-card-title>
                      <div class="headline">User sign in...</div>
                    </v-card-title>
                  </v-card>
                </v-flex>
              <v-card-text>
                <v-flex xs12 sm10 offset-sm1 mt-3>
                  <form @submit.prevent="userSignIn">
                    <v-layout column>
                      <v-flex>
                        <v-alert type="error" dismissible v-model="alert">
                          {{ error }}
                        </v-alert>
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          name="email"
                          label="Email"
                          id="email"
                          type="email"
                          v-model="email"
                          required></v-text-field>
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          name="password"
                          label="Password"
                          id="password"
                          type="password"
                          v-model="password"
                          required></v-text-field>
                      </v-flex>
                      <v-flex class="text-xs-center" mt-3>
                        <v-btn color="secondary" type="submit" :disabled="loading">Sign In</v-btn>
                      </v-flex>
                    </v-layout>
                  </form>
                </v-flex>
                </v-card-text>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </template>


<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      alert: false
    }
  },
  methods: {
    userSignIn () {
      this.$store.dispatch('userSignIn', { email: this.email, password: this.password })
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}
</script>
