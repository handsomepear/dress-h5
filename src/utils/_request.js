import axios from 'axios'
import { Toast } from 'vant'
import { Dialog } from 'vant'
import { _getQueryString } from './_mm'
import store from '../store'
// console.log(store)
const service = axios.create({
  baseURL: 'https://kryptontest.j.cn', // 测试环境
  // baseURL: 'https://krypton-api.j.cn', // 线上环境
  timeout: 10000
})

// TOTO 检测是否登录 登录之后拿到她社区用户信息的id
service.interceptors.request.use(
  config => {
    config.method = config.method || 'post'
    if (config.method === 'post') {
      config.headers = { 'content-type': 'application/json' }
      config.data = {
        clientEnv: {
          app: 'hersh5',
          jcnuserid: store.getters.jcnuserid,
          v: '1.1.1'
        },
        ...config.data
      }
    } else if (config.method === 'get') {
      config.params = {
        clientEnv: {
          app: 'hersh5',
          jcnuserid: store.getters.jcnuserid,
          v: '1.1.1'
        },
        ...config.params
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// window.app_interface.appLoginFinish
service.interceptors.response.use(
  response => {
    if (response.status == 200) {
      if (response.data.bizStatus == 0) {
        return Promise.resolve(response)
      } else {
        if (response.data.bizMessage == '未登录') {
          Dialog.confirm({
            title: '未登录会影响正常下单、收藏等操作哦',
            confirmButtonText: '去登录',
            cancelButtonText: '取消'
          })
            .then(() => {
              window.app_interface.appLogin(0)
            })
            .catch(() => {})
          return Promise.reject()
        } else {
          return Toast(response.data.bizMessage)
        }
      }
    } else if (response.status == 500) {
      return Toast('服务器错误')
    }
  },
  err => {
    return Promise.reject(err)
  }
)

export default service
