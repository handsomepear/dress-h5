/* 订单接口 */
import request from '@/utils/_request'

// 获取首页商品列表
export function getStream(its) {
  return request({ 
    method: 'post',
    url: '/api/product/getStream', 
    data: its ? { its: [its] } : {} 
  })
}

// 获取店铺商品列表
export function getProductListInShop(params) {
  return request({
    method:'post',
    url: '/api/product/getProductListInShop',
    data: {
      pageRecord: params.pageRecord,
      pageSize: params.pageSize,
      shopId: params.shopId
    }
  })
}
// 获取商品信息
export function getProductDetail(productId) {
  return request({
    method: 'post',
    url: '/api/product/getProductDetail',
    data: { productId: productId }
  })
}