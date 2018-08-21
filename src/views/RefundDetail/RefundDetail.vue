<style src="./refundDetail.css" scoped></style>
<template>
  <div class="refund-detail van-top">
    <header>
      <van-nav-bar title="售后详情" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div v-if="returnApplyInfo">
      <div class="order-info">
        <div class="order-list">
          <div class="info" v-for="item in returnApplyInfo.orderSkuList" :key="item.id" @click="viewDetail(item.productId)">
            <div class="pic">
              <img class="t" :src='item.img + "?imageslim"' />
            </div>
            <div class="detail">
              <div class="f28 mb10">{{item.title}}</div>
              <div class="fc-999 mb10">
                <block class="t">
                  <span class="f24">
                    <span v-if="item.color">颜色：{{item.color}}；</span>
                    <span v-if="item.size">尺码：{{item.size}}</span>
                  </span>
                </block>
              </div>
            </div>
          </div>
        </div>
        <!-- 退款信息 -->
        <div class="refund-info">
          <div>退款原因：{{returnApplyInfo.reasonDesc}}</div>
          <div v-if="returnApplyInfo.applyType != 0">申请件数：{{returnApplyInfo.quantity}}</div>
          <div>退款金额：￥{{returnApplyInfo.totalAmount}}</div>
          <div v-if="returnApplyInfo.status == 4">快递公司：{{returnApplyInfo.shipmentInfo.shipmentName}}</div>
          <div v-if="returnApplyInfo.status == 4">退货单号：{{returnApplyInfo.shipmentInfo.shipmentNumber}}</div>
          <div>申请时间：{{returnApplyInfo.createTime}}</div>
          <div>退款编号：{{returnApplyInfo.returnRefundNo}}</div>
        </div>
        <!-- 物流按钮 -->
        <div class="express-btn" v-if="returnApplyInfo.status == 4">
          <div class="btn btn-small btn-info" @click="viewLogistics">查看物流</div>
          <!-- <div class="btn btn-small btn-info" @click="changeLogistics">修改物流</div> -->
        </div>
      </div>
      <!-- 退货进度 -->
      <div class="progress">
        <div class="line"></div>
        <div class="progress-item" :class="index == 0 ? 'active' : ''" v-for="item in returnLogList" :key="item.id">
          <div class="dot"></div>
          <span>{{item.eventDesc}}</span>
          <div class="time">{{item.createTimeStr}}</div>
        </div>
      </div>
      <!-- 退货退款并且商家已经同意退货 -->
      <div class="fill-number" @click="fillNumber" v-if="returnApplyInfo.applyType == 2 && returnApplyInfo.status == 3 ">
        <div class="btn btn-pink btn-big">填写快递单号</div>
      </div>
      <div class="question">
        <!-- 问题说明 -->
        <div class="issue-desc mt20" v-if="returnApplyInfo.detailDesc">问题说明：{{returnApplyInfo.detailDesc}}</div>
        <!-- 凭证 -->
        <div class="evidence" v-if="returnApplyInfo.proofUrl">
          <div class="title">凭证</div>
          <div class="evidence-img">
            <div v-for="(item, index) in proofUrlList" :key="index">
              <img :src="item" />
            </div>
          </div>
        </div>
      </div>
      <!-- 联系客服 -->
      <div class="customer">
        <i class="iconfont icon-waiter-1 fc-pink"></i>
        <span>联系平台客服</span>
      </div>
      <logistics-modal v-if="isShowLogisticsModal" :logisticsInfo="logisticsInfo" @hideLogisticsModal="hideLogisticsModal" :skuList="returnApplyInfo.orderSkuList" />
    </div>
  </div>
</template>

<script>
import { queryLogistics } from '@/api/server'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isShowLogisticsModal: false,
      logisticsInfo: null,
      orderId: null,
      orderSkuId: null
    }
  },
  computed: {
    ...mapGetters(['returnApplyInfo', 'proofUrlList', 'returnLogList'])
  },
  activated() {
    this.orderId = this.$route.query.orderId
    this.orderSkuId = this.$route.query.orderSkuId
    this.getReturnApplyInfo({ orderId: this.orderId, orderSkuId: this.orderSkuId })
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    // 获取售后详情
    getReturnApplyInfo(params) {
      let that = this
      this.$loading.show()
      this.$store
        .dispatch('GetReturnApplyInfo', { orderId: params.orderId, orderSkuId: params.orderSkuId })
        .then(() => {
          that.$loading.hide()
        })
        .catch(err => {
          that.$loading.hide()
        })
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    // 查看物流
    viewLogistics: function() {
      let that = this
      this.$loading.show()
      serviceServer.queryLogistics(
        this.returnApplyInfo.shipmentInfo.id || 1,
        res => {
          that.$loading.hide()
          that.logisticsInfo = res.data
          that.isShowLogisticsModal = true
        },
        err => {
          that.$loading.hide()
        }
      )
    },
    hideLogisticsModal: function() {
      this.isShowLogisticsModal = false
    },
    // 填写订单单号
    fillNumber: function() {
      this.$router.push({ name: 'express', query: { orderId: this.orderId, orderSkuId: this.orderSkuId } })
      // wx.navigateTo({
      //   url:
      //     '../express/express?applyNumber=' +
      //     this.data.returnApplyInfo.applyNumber +
      //     '&orderId=' +
      //     this.data.orderId +
      //     '&orderSkuId=' +
      //     this.data.orderSkuId +
      //     '&skuList=' +
      //     encodeURIComponent(JSON.stringify(this.data.returnApplyInfo.orderSkuList))
      // })
    }
  }
}
</script>


