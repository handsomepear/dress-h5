/* 售后接口 */

import request from '@/utils/_request'
// 提交退货/退款申请
export function addApply(serviceInfo) {
  return request({
    method: 'post',
    url: '/api/customerService/addApply',
    data: serviceInfo
  })
}
// 添加退货物流信息
export function addReturnInfo(logisticsInfo) {
  return request({
    method: 'post',
    url: '/api/customerService/addReturnInfo',
    data: logisticsInfo
  })
}
// 获取退货退款申请信息
export function getReturnApplyInfo(params) {
  return request({
    method: 'post',
    url: '/api/customerService/getReturnApplyInfo',
    data: params
  })
}
// 查看用户退货物流
export function queryLogistics(shipmentId) {
  return request({
    method: 'post',
    url: '/api/customerService/queryLogistics',
    data: { shipmentId: shipmentId }
  })
}
