<template>
    <fragment>
        <v-toolbar>
           <v-app-bar-nav-icon @click="$store.dispatch('drawer/close')">
            <v-icon>mdi-close</v-icon>
           </v-app-bar-nav-icon>
          <v-toolbar-title>{{user ? user.name : ''}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar> 
        <v-list two-line dense class="pt-0 members" >
          <template v-for="(item, index) in menu">

            <v-list-item
              :key="index"
              @click="$router.push(item.path)"
            >
                <v-list-item-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            
            </v-list-item>
          </template>
        </v-list>
        
    </fragment>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      menu:[
        {
          name: 'home',
          path: '/',
          icon: 'mdi-home'
        },
        {
          name: 'login',
          path: '/login',
          icon: 'mdi-login'
        },
        {
          name: 'profile',
          path: '/profile',
          icon: 'mdi-profile'
        }
      ]
    }
  },
  methods: {
      ...mapActions({  logout: 'io/auth/logout' }),

  },
  computed: {
      ...mapState({ 
        user: state => state.io.auth.user,
      })
  }
}
</script>

<style >
.members .v-badge__badge {
    width: 15px;
    height: 15px;
}
.members  .v-badge--overlap .v-badge__badge {
    top: -5px;
    right: 10px;
}
</style>
