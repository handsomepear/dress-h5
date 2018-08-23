<style src="./orderDetail.css" scoped>
</style>
<template>
  <div id="order-detail">
    <header>
      <van-nav-bar title="订单详情" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div v-if="orderDetail" class="van-top">
      <div class="order-detail-container">
        <div class="coder-list">
          <div class="item mb20">
            <div class="title f28">
              <div class="title-name" @click="goStore(orderDetail.shop.id, orderDetail.shop.name)">
                <i class="iconfont icon-shop f26 mr10"></i>
                <span class="f28">{{orderDetail.shop.name}}</span>
              </div>
              <div class="fr fc-pink" v-if="!orderDetail.duringAfterSale && orderDetail.status == 1">
                等待发货
              </div>
              <div class="fr fc-pink" v-if="!orderDetail.duringAfterSale &&orderDetail.status == 2">
                等待收货
              </div>
              <div class="fr fc-pink" v-if="!orderDetail.duringAfterSale && orderDetail.status == 3 || !orderDetail.duringAfterSale && orderDetail.status == 6">
                交易成功
              </div>
              <div class="fr fc-pink" v-if="orderDetail.duringAfterSale">售后处理中</div>
              <div class="fr fc-pink" v-if="!orderDetail.duringAfterSale && orderDetail.status == 5">
                订单关闭
              </div>
            </div>
            <div class="goods">
              <div class="info mb20" v-for="one in orderDetail.skuList" :key="one.id" @click="viewDetail(one.productId)">
                <div class="pic">
                  <img class="t" :src='one.img + "?imageslim"' mode="widthFix" />
                </div>
                <div class="detail">
                  <p class="f28 mb10">{{one.title}}</p>
                  <div class="fc-9b mb10">
                    <span class="f24" v-if="one.color">颜色:{{one.color}};</span>
                    <span class="f24" v-if="one.size">尺码:{{one.size}};</span>
                  </div>
                  <div class="f28">
                    ￥{{one.price}}
                    <span class="fr">
                      <span class="f20">X</span>
                      <span>{{one.quantity}}</span>
                    </span>
                  </div>
                  <div v-if="(orderDetail.afterSaleStatus == -1) && (orderDetail.status != 6) && (orderDetail.status != 1)">
                    <div class="total tr" v-if="one.afterSaleStatus == -1">
                      <div class="btn btn-small btn-info" @click.stop="applyServiceSingle(orderDetail.id, orderDetail.orderNo, one)">
                        申请售后
                      </div>
                    </div>
                    <div class="total tr" v-else @click.stop="viewSingleService(one.id)">
                      <div class="fc-pink" v-if="one.afterSaleStatus == 0">等待商家审核 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 1">商家同意退款 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 2">已退款 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 3">退款被商家拒绝 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 4">退货被商家拒绝 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 5">商家同意退货 ></div>
                      <div class="fc-pink" v-if="one.afterSaleStatus == 7">买家已退货 ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="total tr">
              <span class="count">共{{orderDetail.quantity}}件商品</span>
              合计：
              <span class="fc-pink f32">￥{{orderDetail.price}}元</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 售后状态 -->
      <div v-if="orderDetail.afterSaleStatus == 0 || orderDetail.afterSaleStatus == 1 ||  orderDetail.afterSaleStatus == 2 || orderDetail.afterSaleStatus == 3 || orderDetail.afterSaleStatus == -2">
        <div class="service-state" v-if="orderDetail.afterSaleStatus == -2">
          订单状态：
          <span class="fc-pink">系统原因导致创建订单失败</span>
        </div>
        <div v-else @click="viewAllService" class="service-state">
          售后状态：
          <span class="fc-pink" v-if="orderDetail.afterSaleStatus == 0">审核中</span>
          <span class="fc-pink" v-if="orderDetail.afterSaleStatus == 1">退款中</span>
          <span class="fc-pink" v-if="orderDetail.afterSaleStatus == 2">已退款</span>
          <span class="fc-pink" v-if="orderDetail.afterSaleStatus == 3">商家拒绝</span>
          <div class="triangle">
            <div class="content"></div>
          </div>
        </div>
      </div>
      <!-- 收件人信息 -->
      <div class="address-info">
        <!-- 收货人 -->
        <div class="consignee">
          收货人：
          <span class="name">{{orderDetail.addressInfo.name || ''}}</span>
          <span class="tel" v-if="orderDetail.addressInfo.tel">{{orderDetail.addressInfo.tel | hideTelNumber}}</span>
        </div>
        <div class="address">
          {{orderDetail.addressInfo.addrProvince}} {{orderDetail.addressInfo.addrCity}} {{orderDetail.addressInfo.addrDistrict}} {{orderDetail.addressInfo.addrDetail}}
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-info">
        <div>订单编号：{{orderDetail.orderNo}}</div>
        <div>付款时间：{{orderDetail.payTime}}</div>
        <div v-if="orderDetail.sendTime">发货时间：{{orderDetail.sendTime}}</div>
        <div v-if="orderDetail.receiveTime">收货时间：{{orderDetail.receiveTime}}</div>
      </div>
      <!-- action -->
      <div>
        <div class="order-action" v-if="orderDetail.status == 2">
          <div class="btn btn-small btn-info mr20" @click="viewLogistics">查看物流</div>
          <div class="btn btn-small btn-pink" @click="showReceiptModal">确认收货</div>
        </div>
        <div class="order-action" v-if="orderDetail.status == 3 || orderDetail.status == 5 || orderDetail.status == 6">
          <div class="btn btn-small btn-info mr20" @click="buyAgain">再次购买</div>
        </div>
        <div v-if="!orderDetail.duringAfterSale || orderDetail.status != 6">
          <div class="order-action" v-if="orderDetail.status == 1 && orderDetail.afterSaleStatus == -1">
            <div class="btn btn-small btn-info mr20" @click="returnHandle">退款</div>
          </div>
        </div>
      </div>
      <!-- refund modal -->
      <div class="refund-modal-wrap" @click="hideRefundModal" v-if="isShowRefundModal">
        <div class="refund-modal" @click.stop>
          <!-- 仅退款 -->
          <div class="refund-only refund" @click="applyService(1)">
            <div class="title">
              <i class="iconfont icon-return"></i>
              <span>仅退款</span>
            </div>
            <div class="desc">未收到货(包含未签收),或卖家协商同意前提下</div>
            <div class="triangle">
              <div class="content"></div>
            </div>
          </div>
          <!-- 退货退款 -->
          <div class="return-sale refund" @click="applyService(2)">
            <div class="title">
              <i class="iconfont icon-return"></i>
              <span>退货退款</span>
            </div>
            <span class="desc">已收到货，需要退换已收到的货物</span>
            <div class="triangle">
              <div class="content"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <button plain="true" open-type="contact">
        <div class="customer">
          <i class="iconfont icon-waiter-1 fc-pink"></i>
          <span>联系平台客服</span>
        </div>
      </button> -->
      <logistics-modal v-if="isShowLogisticsModal" @hideLogisticsModal="hideLogisticsModal" :logisticsInfo="logisticsInfo" :skuList="orderDetail.skuList"></logistics-modal>
    </div>
  </div>
</template>

<script>
import LogisticsModal from '@/components/LogisticsModal/LogisticsModal'
import { orderDetail, queryLogistics, confirmReceive } from '@/api/order'
import { batchAddCart } from '@/api/user'
export default {
  components: {
    LogisticsModal
  },
  data() {
    return {
      isShowRefundModal: false,
      isShowLogisticsModal: false,
      logisticsInfo: null,
      orderId: null,
      serviceInfo: null,
      orderDetail: null
    }
  },
  activated() {
    this.orderId = this.$route.query.orderId
    this.getOrderDetail()
  },
  methods: {
    // 获取订单详情
    getOrderDetail() {
      let that = this
      this.$loading.show()
      orderDetail(this.$route.query.orderId).then(res => {
        that.$loading.hide()
        that.orderDetail = res.data.detail
      })
    },
    navigateBack() {
      this.$router.back()
    },
    goStore(shopId, shopTitle) {
      this.$router.push({ name: 'shop', query: { shopId, shopTitle } })
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    // 控制售后弹窗
    hideRefundModal() {
      this.isShowRefundModal = false
    },
    showRefundModal() {
      this.isShowRefundModal = true
    },
    // 售后弹窗
    applyService(type) {
      let serviceInfo = this.serviceInfo ? this.serviceInfo : this.orderDetail
      serviceInfo.serviceType = type
      this.$store.commit('SET_SERVICE_INFO', serviceInfo) // 保存售后的商品信息
      this.hideRefundModal()
      this.$router.push({name: 'refund'})
    },
    // 未发货退款
    returnHandle() {
      let serviceInfo = {}
      if (this.orderDetail.status == 1) {
        serviceInfo = this.orderDetail
        serviceInfo.serviceType = 0
        this.$store.commit('SET_SERVICE_INFO', serviceInfo)
        this.$router.push({ name: 'refund' })
      } else {
        this.showRefundModal()
      }
    },
    hideLogisticsModal() {
      this.isShowLogisticsModal = false
    },
    // 查看物流
    viewLogistics() {
      let that = this
      this.$loading.show()
      queryLogistics(this.orderId)
        .then(res => {
          that.$loading.hide()
          console.log(res.data)
          that.logisticsInfo = res.data
          that.isShowLogisticsModal = true
        })
        .catch(err => {
          that.$loading.hide()
        })
    },
    // 确认收货弹窗
    showReceiptModal() {
      let that = this
      this.$dialog
        .confirm({
          title: '您收到货品了吗？',
          confirmButtonText: '已收货',
          showCancelButton: true
        })
        .then(() => {
          that.confirmReceive()
        })
        .catch(() => {})
    },
    // 确认收货
    confirmReceive() {
      let that = this
      this.$loading.show()
      confirmReceive(this.orderId, res => {
        that.$loading.hide()
        that.$toast('已收货')
        setTimeout(() => {
          that.getOrderDetail()
        }, 1500)
      })
    },
    // 单个商品售后
    applyServiceSingle(orderId, orderNo, skuInfo) {
      this.showRefundModal()
      var serviceInfo = {}
      serviceInfo.skuList = [skuInfo]
      serviceInfo.id = orderId
      serviceInfo.orderNo = orderNo
      serviceInfo.isSingle = true // 单商品售后
      this.serviceInfo = serviceInfo
    },
    viewAllService() {
      let that = this
      this.$router.push({ name: 'refundDetail', query: { orderSkuId: 0, orderId: that.orderId } })
    },
    // 查看单个商品售后详情
    viewSingleService(skuId) {
      let that = this
      this.$router.push({ name: 'refundDetail', query: { orderSkuId: skuId, orderId: that.orderId } })
    },
    // 再次购买
    buyAgain() {
      let that = this
      let skuList = []
      this.$loading.show()
      this.orderDetail.skuList.forEach(item => {
        skuList.push({
          productSkuId: item.skuId,
          quantity: item.quantity
        })
      })
      batchAddCart(skuList).then(res => {
        that.$loading.hide()
        that.$store.commit('SET_BUYAGAIN_LIST', that.orderDetail.skuList)
        that.$store.commit('SET_BUYAGAIN_SHOP', that.orderDetail.shop)
        that.$router.push({ name: 'cart' })
      })
    }
  }
}
</script>


