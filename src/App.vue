<template>
 <v-app>
 
  <v-navigation-drawer  v-bind="drawer.bind" v-on="drawer.on" ><drawer-content></drawer-content></v-navigation-drawer>
  <v-navigation-drawer  v-bind="cart.bind" v-on="cart.on" ><cart-content></cart-content></v-navigation-drawer>
  <ToolbarContent v-if="!$route.meta.login" />
 
  <v-content :class="{'secondary': $route.meta.login}" >
    <v-container fluid dar fill-height class="pa-0"> 
      <router-view></router-view>
    </v-container>
  </v-content>
  <BottomSheet />
  <v-dialog  v-bind="dialog.bind" v-on="dialog.on">
    <component v-bind:is="dialog.component.bind" v-bind="dialog.component.bind" v-on="dialog.component.on" />
  </v-dialog>
  <v-snackbar
      v-model="snackbar.value"
      :absolute="snackbar.absolute"
      :color="snackbar.color"
      :auto-height="snackbar.autoHeight"
      :bottom="snackbar.y === 'bottom'"
      :left="snackbar.x === 'left'"
      :multi-line="snackbar.mode === 'multi-line'"
      :right="snackbar.x === 'right'"
      :timeout="snackbar.timeout"
      :top="snackbar.y === 'top'"
      :vertical="snackbar.mode === 'vertical'"
    >
    {{ snackbar.text }}  
      <v-btn
        dark
        icon
        @click="snackbarClose"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
   
</v-app>
</template>

<script>
import dialogs from './dialogs'
import ToolbarContent from './components/Toolbar'
import DrawerContent from './components/Drawer'
import CartContent from './components/Cart'
 
import BottomSheet from './components/BottomSheet'

import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    ...dialogs,
    ToolbarContent,
    DrawerContent,
    CartContent,
    BottomSheet
  },
  computed: {
     ...mapGetters({
        isAuthenticated: 'io/auth/isAuthenticated'
    }),
    ...mapState({ 
      dialog: state => state.dialog,
      drawer: state => state.drawer, 
      cart: state => state.cart, 
      snackbar: state => state.snackbar, 
      toolbar: state => state.toolbar }),
  },
  watch: {
    '$store.state.io.auth.error': {
      handler: 'handelError'
    },
    '$store.state.io.error': {
      handler: 'handelSocketError'
    }
  },
  methods: {
    ...mapMutations({
       setUser: 'io/auth/user', setToken: 'io/auth/token' }), 
    ...mapActions( {
      feed: 'products/feed',
      snackbarOpen: 'snackbar/open', 
      snackbarClose: 'snackbar/close', 
      logout: 'io/auth/logout' }),
    checkLocalStorage () {
        if (localStorage.getItem('token'))
          this.setToken(localStorage.getItem('token'))
        if (localStorage.getItem('user'))
          this.setUser(JSON.parse(localStorage.getItem('user')))
    },
    handelSocketError (err) {
      if (err) {
        this.handelError(err)
      }
    },
    handelError (err) {
        if (err !== null) {
          if (err.response && err.response.data) {
              let msg = typeof err.response.data === 'string' ? err.response.data : err.response.data.message
              this.snackbarOpen([msg, 'error'])
          } else {
              this.snackbarOpen([err, 'error'])
          }
        }
      
        
    },
  },
 
  created () {
    this.checkLocalStorage()
  }
}
</script>
<style scoped>

.body-bg{
  background-color: #0f0e11;
}

</style>
