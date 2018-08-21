import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import element from './modules/element'
import product from './modules/product'
import order from './modules/order'
import server from './modules/server'
import getters from './getters'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    element,
    order,
    product,
    server
  },
  getters
})
export default store