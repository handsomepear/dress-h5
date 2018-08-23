import { orderList, preOrder, commitOrder } from '@/api/order'
import { _getQueryStringFromUrl } from '@/utils/_mm'
const order = {
  state: {
    orderList: [],
    buyAgainList: null, // 再次购买的商品SKU列表
    buyAgainShop: null // 再次购买的商品信息
  },

  mutations: {
    SET_BUYAGAIN_LIST: (state, buyAgainList) => {
      state.buyAgainList = buyAgainList
    },
    SET_BUYAGAIN_SHOP: (state, buyAgainShop) => {
      state.buyAgainShop = buyAgainShop
    }
  },

  actions: {
    // 结算订单
    PreOrder: ({ commit }, paramList) => {
      return new Promise((resolve, reject) => {
        preOrder(paramList)
          .then(res => {
            resolve(res.data.preOrderInfo)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 支付订单
    CommitOrder: ({ commit }, addrId) => {
      return new Promise((resolve, reject) => {
        commitOrder(addrId)
          .then(res => {
            let mwebUrl = res.data.mwebUrl
            
            resolve(mwebUrl)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default order
