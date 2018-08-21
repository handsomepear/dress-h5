import {
  getCartList,
  removeCart,
  addCart,
  getAddressList,
  setDefaultAddress,
  addOrUpdateAddress,
  removeAddress,
  commitUserInfo
} from '@/api/user'
const user = {
  state: {
    cartList: [],
    likeList: [],
    editAddrInfo: {}, // 修改地址信息
    orderAddress: null, // 下订单的时候的地址信息
    addressList: [], // 地址列表
    // userInfo: {id: 17192},
    userInfo: null,
    jcnuserid: null
  },

  mutations: {
    // 设置用户信息
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    // 设置用户id
    SET_JCNUSERID: (state, jcnuserid) => {
      state.jcnuserid = jcnuserid
    },
    // 设置购物车
    SET_CART_LIST: (state, cartList) => {
      state.cartList = cartList
    },
    // 删除购物车某个商品
    DELETE_CART_GOOD: (state, { storeIndex, skuIndex }) => {
      state.cartList[storeIndex].productSkuInfoList.splice(skuIndex, 1)
    },
    // 设置地址列表
    SET_ADDRESS_LIST: (state, addressList) => {
      state.addressList = addressList
    },
    // 设置修改的地址信息
    SET_EDIT_ADDR_INFO: (state, editAddrInfo) => {
      state.editAddrInfo = editAddrInfo
    },
    // 选择收货地址
    CHOOSE_ADDR_INFO: (state, addrInfo) => {
      state.orderAddress = addrInfo
    }
  },

  actions: {
    // Login
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('SET_USERINFO', userInfo)
        commit('SET_JCNUSERID', userInfo.id)
        commitUserInfo({
          avatar: userInfo.headUrl,
          gender: 2,
          nickName: userInfo.nickName,
          platform: 2,
          unionId: ''
        })
          .then(res => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // Login({ commit }) {
    //   if (window.app_interface) {
    //     window.app_interface.getHersUserInfo('getUserInfo')
    //     window.getUserInfo = function(userInfo) {
    //       userInfo = JSON.parse(userInfo)
    //       commit('SET_USERINFO', userInfo)
    //       commit('SET_JCNUSERID', userInfo.id)
    //       localStorage.setItem('userInfo', userInfo)
    //       localStorage.setItem('userId', userInfo.id)
    //       return new Promise((resolve, reject) => {
    //         commitUserInfo({
    //           avatar: userInfo.headUrl,
    //           gender: 2,
    //           nickName: userInfo.nickName,
    //           platform: 2, // 2 代表她社区
    //           unionId: ''
    //         })
    //           .then(res => {
    //             resolve()
    //           })
    //           .catch(err => {
    //             reject(err)
    //           })
    //       })
    //     }
    //   }
    // },
    // 获取购物车列表
    GetCartList({ commit }) {
      return new Promise((resolve, reject) => {
        getCartList()
          .then(res => {
            commit('SET_CART_LIST', res.data.cartList)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除购物车商品
    DeleteCartGood({ commit }, { skuIds, storeIndex, skuIndex }) {
      return new Promise((resolve, reject) => {
        removeCart(skuIds)
          .then(res => {
            commit('DELETE_CART_GOOD', { storeIndex, skuIndex })
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 添加购物车
    AddCart({ commit }, { oldProductSkuId, productSkuId, quantity, type }) {
      return new Promise((resolve, reject) => {
        addCart({
          oldProductSkuId,
          productSkuId,
          quantity,
          type
        })
          .then(res => {
            resolve()
          })
          .catch(err => {
            reject()
          })
      })
    },
    // 地址列表
    GetAddressList({ commit }) {
      return new Promise((resolve, reject) => {
        getAddressList()
          .then(res => {
            commit('SET_ADDRESS_LIST', res.data.addressList)
            resolve(res.data.addressList)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 设置默认地址
    SetDefaultAddress({ commit }, { oldId, newId }) {
      return new Promise((resolve, reject) => {
        setDefaultAddress({ oldId, newId })
          .then(() => {
            resolve()
          })
          .catch(err => {
            reject()
          })
      })
    },
    // 添加或者更新地址
    AddOrUpdateAddress({ commit }, { addrCity, addrDetail, addrDistrict, addrProvince, id, name, tel }) {
      return new Promise((resolve, reject) => {
        addOrUpdateAddress({ addrCity, addrDetail, addrDistrict, addrProvince, id, name, tel })
          .then(res => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 删除地址
    RemoveAddress({ commit }, addressId) {
      return new Promise((resolve, reject) => {
        removeAddress(addressId)
          .then(res => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default user
