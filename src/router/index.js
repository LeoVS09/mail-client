import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Message from '../views/Message'
import Send from '../views/Send'
import routes from './routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: routes.HOME,
      component: Home
    },
    {
      path: '/message/:id',
      name: routes.MESSAGE,
      component: Message
    },
    {
      path: '/send',
      name: routes.SEND,
      component: Send
    }
  ]
})

export {
  routes
}
