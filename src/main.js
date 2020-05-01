import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import { Plugin } from 'vue-fragment'
Vue.use(Plugin)
Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiersAuth)) {
    
    if (!store.getters['io/auth/isAuthenticated']) {
      console.log('anuthurized');
      await store.dispatch('io/auth/logout')
      return next('/login')
    } else if (to.name == 'login') {
      return next('/')
    }
  }
  next()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
