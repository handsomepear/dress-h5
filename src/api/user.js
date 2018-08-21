import request from '@/utils/_request'
/* 用户接口 */

// 加收藏
export function addFavorite(productId) {
  return request({
    method: 'post',
    url: '/api/user/addFavorite',
    data: { productId }
  })
}

// 登录
export function commitUserInfo(userInfo) {
  return request({
    method: 'post',
    url: '/api/user/commitUserInfo',
    data: userInfo
  })
}

// 加购物车
export function addCart(productInfo) {
  return request({
    method: 'post',
    url: '/api/user/addCart',
    data: productInfo
  })
}
// 批量添加购物车
export function batchAddCart(skuList) {
  return request({
    method: 'post',
    url: '/api/user/batchAddCart',
    data: { skuList: skuList }
  })
}

// 添加或者修改地址
export function addOrUpdateAddress(addressInfo) {
  return request({
    method: 'post',
    url: '/api/user/addOrUpdateAddress',
    data: addressInfo
  })
}
// 取消收藏
export function cancelFavorite(FavoriteInfo) {
  return request({
    method: 'post',
    url: '/api/user/cancelFavorite',
    data: FavoriteInfo
  })
}

// 获取地址列表
export function getAddressList(resolve, reject) {
  return request({
    method: 'post',
    url: '/api/user/getAddressList'
  })
}
// 获取购物车商品列表
export function getCartList(resolve, reject) {
  return request({
    method: 'post',
    url: '/api/user/getCartList'
  })
}
// 获取收藏列表
export function getFavoritesList(nextPage) {
  return request({
    method: 'post',
    url: '/api/user/getFavoritesList',
    data: { nextPage: nextPage }
  })
}
//  删除地址
export function removeAddress(addressId) {
  return request({
    method: 'post',
    url: '/api/user/removeAddress',
    data: { id: addressId }
  })
}
// 从购物车移除商品
export function removeCart(productSkuIds) {
  return request({
    method: 'post',
    url: '/api/user/removeCart',
    data: { productSkuIds: productSkuIds }
  })
}
// 设置默认收货地址
export function setDefaultAddress(addrIdInfo) {
  return request({
    method: 'post',
    url: '/api/user/setDefaultAddress',
    data: addrIdInfo
  })
}
