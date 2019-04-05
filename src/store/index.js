import Vue from 'vue'
import Vuex from 'vuex'
import {State} from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: new State(),
  mutations,
  actions
})

export {
  ACTIONS
} from './types'
