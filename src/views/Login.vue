<template >
   <v-row
          align="center"
          justify="center"
        >
            <img src="./../assets/Logo-mo-text.png" width="150" />
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
         
         <v-card v-if="isAuthenticated"
    class="mx-auto"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ><v-img :src="user.avatar_urls[96]"></v-img></v-list-item-avatar>
      <v-list-item-content>
        <div class="overline mb-4">מחובר בשם</div>
        <v-list-item-title class="headline mb-1">{{ user.name }}</v-list-item-title>
      </v-list-item-content>

    </v-list-item>

    <v-card-actions>
      <v-btn text @click="logout">התנתק</v-btn>
    </v-card-actions>
  </v-card>
          </v-col>
        </v-row>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      loading: state => state.io.auth.loading,
      user: state => state.io.auth.user,
      secret: state => state.io.auth.token.secret
    }),
     ...mapGetters({
        isAuthenticated: 'io/auth/isAuthenticated'
    }),
  },
  methods: {
    ...mapActions( {
      auth: 'io/auth/authorize',
      access: 'io/auth/access',
      logout: 'io/auth/logout'  
    }),
   
  },
  async created() {
    console.log(this.$store)
    if (this.isAuthenticated) return // escape if loged in 
    const { oauth_token, oauth_verifier } = this.$route.query
    if (oauth_token && oauth_verifier) {
      // exchange tokens
      await this.access({ oauth_token, oauth_verifier })
    } else {
      // send a login request
      await this.auth()
    }
  },
}
</script>