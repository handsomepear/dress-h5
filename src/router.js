import Vue from 'vue'
import Router from 'vue-router'
import store from './store/index'
import { Dialog } from 'vant'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      meta: { requireAuth: false, keepAlive: true },
      component: resolve => {
        require(['@/views/Index/Index.vue'], resolve)
      }
    },
    {
      path: '/cart',
      name: 'cart',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Cart/Cart.vue'], resolve)
      }
    },
    {
      path: '/mine',
      name: 'mine',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Mine/Mine.vue'], resolve)
      }
    },
    {
      path: '/goodDetail',
      name: 'goodDetail',
      meta: { requireAuth: false, keepAlive: true },
      component: resolve => {
        require(['@/views/GoodDetail/GoodDetail.vue'], resolve)
      }
    },
    {
      path: '/shop',
      name: 'shop',
      meta: { requireAuth: false, keepAlive: true },
      component: resolve => {
        require(['@/views/Shop/Shop.vue'], resolve)
      }
    },
    {
      path: '/address',
      name: 'address',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Address/AddressList.vue'], resolve)
      }
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Address/AddAddress.vue'], resolve)
      }
    },
    {
      path: '/settlement',
      name: 'settlement',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Settlement/Settlement.vue'], resolve)
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/OrderDetail/OrderDetail.vue'], resolve)
      }
    },
    {
      path: '/result',
      name: 'result',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/PayResult/PayResult.vue'], resolve)
      }
    },
    {
      path: '/refund',
      name: 'refund',
      meta: { requireAuth: true, keepAlive: false },
      component: resolve => {
        require(['@/views/Refund/Refund.vue'], resolve)
      }
    },
    {
      path: '/refundDetail',
      name: 'refundDetail',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/RefundDetail/RefundDetail.vue'], resolve)
      }
    },
    {
      path: '/express',
      name: 'express',
      meta: { requireAuth: true, keepAlive: true },
      component: resolve => {
        require(['@/views/Express/Express.vue'], resolve)
      }
    },
    {
      path: '/resultCheck',
      name: 'resultCheck',
      meta: { requireAuth: false, keepAlive: true },
      component: resolve => {
        require(['@/views/ResultCheck/ResultCheck.vue'], resolve)
      }
    }
  ]
  // TODO 页面保留原始位置
})

// main.js
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)

router.beforeEach(function(to, from, next) {
  if (to.meta.requireAuth) {
    if (!store.getters.userInfo || store.getters.userInfo.id == 0) {
      Dialog.confirm({
        title: '未登录会影响正常下单、收藏等操作哦',
        confirmButtonText: '去登录',
        cancelButtonText: '取消'
      })
        .then(() => {
          window.app_interface.appLogin(0)
        })
        .catch(() => {})
    } else {
      next()
    }
  } else {
    next()
  }
  // const toIndex = history.getItem(to.path)
  // const fromIndex = history.getItem(from.path)
  // if (toIndex) {
  //   if (
  //     !fromIndex ||
  //     parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
  //     (toIndex === '0' && fromIndex === '0')
  //   ) {
  //     store.commit('UPDATE_DIRECTION', { direction: 'forward' })
  //   } else {
  //     store.commit('UPDATE_DIRECTION', { direction: 'reverse' })
  //   }
  // } else {
  //   ++historyCount
  //   history.setItem('count', historyCount)
  //   to.path !== '/' && history.setItem(to.path, historyCount)
  //   store.commit('UPDATE_DIRECTION', { direction: 'forward' })
  // }
})

export default router
