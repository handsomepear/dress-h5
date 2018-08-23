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

import * as filters from './filters/filter'


if (window.app_interface) {
  window.appLoginFinish = (status, userId) => {
    if (status == 200) {
      that.active = 0
      window.app_interface.getHersUserInfo('getUserInfo')
    }
  }
  window.getUserInfo = function(userInfo) {
    alert(userInfo)
    userInfo = JSON.parse(userInfo)
    if (userInfo.id !== 0) {
      store.dispatch('Login', userInfo)
    }
  }
  window.app_interface.getHersUserInfo('getUserInfo')
  window.app_interface.setTitleVisible(0)
}

// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

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
