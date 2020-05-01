<template>
    <v-app-bar v-bind="toolbar.bind" v-on="toolbar.on">
    
        <v-app-bar-nav-icon v-if="isHome" @click="drawerToggle"></v-app-bar-nav-icon>
        <v-app-bar-nav-icon v-else @click="$router.go(-1)"><v-icon>mdi-arrow-left</v-icon></v-app-bar-nav-icon>
        <!-- <v-btn
            fab
            color="green"
            bottom
            left
            absolute
            @click=" "
          >
            <v-icon>add</v-icon>
          </v-btn> -->
        
        <v-toolbar-title  >
          <v-img src="./../assets/Logo-mo.png" width="30"></v-img>
           <v-text-field
            v-if="searching && $route.name == 'items'"
            autofocus
            dark
            label="search"
            solo
            v-model="searchText"
          ></v-text-field> 
        </v-toolbar-title> 
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon v-if="isHome" @click="cartToggle">
          <v-badge color="green"
          content="6"
          left
          overlap
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-app-bar-nav-icon>
        <!-- <v-btn depressed  v-if="!isAuth"  small  color="success" @click="dialog('Register')">
        <v-btn depressed   small icon color="primary" @click="toggleSearch"><v-icon>{{searching ? 'close' : 'search'}}</v-icon></v-btn>     
        <v-btn depressed   small icon color="primary" @click="$router.push('items/new')"><v-icon color="green">add_circle</v-icon></v-btn>     
        <v-btn depressed   small icon color="primary" :loading="itemsLoading" @click="$store.dispatch('items/save')"><v-icon>mdi-save</v-icon></v-btn>     
        
            Register
        </v-btn>
        <v-btn depressed  v-if="!isAuth"  small  color="purple darken-4" @click="dialog('Login')">
            Login
        </v-btn>
        <v-btn depressed v-else  color="red"  @click="logout">
            logout
        </v-btn> -->
           
    </v-app-bar>
</template>


<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { EventBus } from './../util'

export default {
    data () {
        return {
            cameraIcon: 'camera_front',
            isHome: true,
            itemId: null,
            isLoading: false,
 
            fullscreen: false
        }
    },
    watch: {
      '$route' (to) {
        this.isHome = to.name == 'home'
      },
      fullscreen (applyFullscreen) {
          const app = document.querySelector('#app')
          applyFullscreen ? openFullscreen(app): closeFullscreen(app)
      }
    },
    computed: {
        ...mapState({ user: state => state.io.auth.user,
          drawer: state => state.drawer, 
          toolbar: state => state.toolbar,
          search: state => state.items.search,
          searching: state => state.items.searching,
          itemsLoading: state => state.items.loading
         }),
        ...mapGetters({ isAuth: 'io/auth/isAuthenticated', searchStarted: 'items/searchStarted' }),
        searchText: {
          set (value) {
            this.setSearch(value)
          },
          get () {
            return this.search
          }
        },
    },
    methods: {
        ...mapActions({  
          drawerToggle: 'drawer/toggle', 
          cartToggle: 'cart/toggle', 
          open: 'dialog/open', 
          login: 'io/auth/login', 
          logout: 'io/auth/logout' }),
        ...mapMutations({
          toggleSearch: 'items/toggleSearch',
          setSearch: 'items/search'
        }),
  
        dialog (title) {
            this.open({
                maxWidth: 350,
                component: { 
                    is: 'login',
                    title,
                    color: title.toLowerCase() == "login" ? 'primary' : 'success' 
                }
            })
        } 
    }
}


function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}
</script>

<style scoped>
.pointer {
    cursor: pointer;
}
</style>

