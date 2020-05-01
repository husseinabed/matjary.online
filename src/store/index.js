import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import router from './../router'
import VuexPersistence from 'vuex-persist' // save state to localstorage
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    io:{
      auth:{
        token: state.io.auth.token,
        user: state.io.auth.user
      }
    }   
  }), //only save navigation module
})

import modules from './modules'
Vue.use(Vuex)

const store = new Store({
  modules,
  plugins: [vuexLocal.plugin]
})
store.watch((state, getters) => getters['io/auth/isAuthenticated'], async (value, oldValue) => {
  
  // const { auth,  socket, fetch } = store.state.io
  // const { user, token  } = auth
  // localStorage.setItem('user', JSON.stringify(user))
  // localStorage.setItem('token', token)
  // // Alter Authorization header for authonticated routes.
  // fetch.defaults.headers.common['Authorization'] = token ? 'bearer ' + token : null;
  
  if (value /* Authurized? */) {
    router.push('/')
  } else  {
    router.push('/login')
  }
  
})


export default store;
  
