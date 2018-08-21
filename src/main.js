import Vue from 'vue'

import './styles/normalize.css'

import Vant from 'vant'
import { Toast } from 'vant'
import 'vant/lib/vant-css/index.css'
import './styles/vant.css' // 定制vant css



import 'lib-flexible' // rem
import VueClipboard from 'vue-clipboard2'

import './styles/app.css' // global css

import loading from './plugin/loading'


import App from './App.vue'
import router from './router'
import store from './store/index'

Toast.setDefaultOptions({
  forbidClick: true,
  duration: 1500
})

Vue.use(Vant)
Vue.use(loading)
Vue.use(VueClipboard)

Vue.config.devtools = true
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
