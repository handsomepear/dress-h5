const getters = {
  isShowTabBar: state => state.element.isShowTabBar,
  mineTab: state => state.element.mineTab,

  name: state => state.user.name,
  cartList: state => state.user.cartList,
  addressList: state => state.user.addressList,
  editAddrInfo: state => state.user.editAddrInfo, // 编辑地址表单回填信息
  orderAddress: state => state.user.orderAddress,
  jcnuserid: state => state.user.jcnuserid, // 用户的唯一标识
  userInfo: state => state.user.userInfo,

  preOrderInfo: state => state.order.preOrderInfo,

  serviceInfo: state => state.server.serviceInfo,
  returnApplyInfo: state => state.server.returnApplyInfo, // 售后信息
  proofUrlList: state => state.server.proofUrlList, 
  returnLogList: state => state.server.returnLogList ,
  expressArray: state => state.server.expressArr
}

export default getters
