import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {loadMails} from './core'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

try {
  loadMails()
      .catch(e => console.error(e))
} catch (e) {
  console.error(e)
}
