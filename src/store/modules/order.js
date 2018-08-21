import { orderList, preOrder, commitOrder } from '@/api/order'
const order = {
  state: {
    preOrderInfo: {}, // 未付款的订单信息
    orderList: [],
    buyAgainList: null, // 再次购买的商品SKU列表
    buyAgainShop: null // 再次购买的商品信息
  },

  mutations: {
    SET_PREORDER_INFO: (state, preOrderInfo) => {
      state.preOrderInfo = preOrderInfo
    },
    SET_BUYAGAIN_LIST: (state, buyAgainList) => {
      state.buyAgainList = buyAgainList
    },
    SET_BUYAGAIN_SHOP: (state, buyAgainShop) => {
      state.buyAgainShop = buyAgainShop
    },
  },

  actions: {
    // 结算订单
    PreOrder: ({ commit }, paramList) => {
      return new Promise((resolve, reject) => {
        preOrder(paramList)
          .then(res => {
            commit('SET_PREORDER_INFO', res.data.preOrderInfo)
            resolve()
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
            console.log(res)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default order
