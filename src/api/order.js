/* 订单接口 */
import request from '@/utils/_request'

// 提交当前订单
export function commitOrder(addrId) {
  return request({
    method: 'post',
    url: '/api/order/commitOrder',
    data: { addrId: addrId }
  })
}
// 获取订单详情
export function orderDetail(orderId) {
  return request({
    method: 'post',
    url: '/api/order/orderDetail',
    data: { orderId: orderId }
  })
}
// 获取订单列表
export function orderList(params) {
  return request({
    method: 'post',
    url: '/api/order/orderList',
    data: {
      its: params.its,
      pageRecord: params.pageRecord,
      pageSize: params.pageSize
    }
  })
}
// 结算订单
export function preOrder(list) {
  return request({
    method: 'post',
    url: '/api/order/preOrder',
    data: { list: list }
  })
}
// 确认收货
export function confirmReceive(orderSubId) {
  return request({
    method: 'post',
    url: '/api/order/confirmReceive',
    data: { orderSubId: orderSubId }
  })
}
// 查看物流
export function queryLogistics(orderSubId) {
  return request({
    method: 'post',
    url: '/api/order/queryLogistics',
    data: { orderSubId: orderSubId }
  })
}
// 获取物流公司
export function getExpressCompanys(resolve, reject) {
  return request({
    method: 'post',
    url: '/api/order/getExpressCompanys'
  })
}
export function sendNotify(params) {
  return request({
    method: 'post',
    url: '/api/order/sendNotify',
    data: params
  })
}
