<style src="./settlement.css" scoped></style>

<template>
  <div id="settlement">
    <header>
      <van-nav-bar title="提交订单" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div v-if="preOrderInfo" class="van-top">
      <!-- 收货地址 -->
      <div class="address-container" @click="setAddress">
        <div class="address-wrap">
          <div class="address-l">
            <div class="not-address" v-if="!defaultAddress">
              <i class="iconfont icon-position-2"></i>
              <span class="fc-pink">请添加收货地址</span>
            </div>
            <div class="address" v-else>
              <div class="recipients-info">
                <span class="name">{{defaultAddress.name}}</span>
                <!-- <span class="tel">{{tools.hideTelNumber(address.tel)}}</span> -->
                <!-- 过滤用户手机号中四位 -->
                <span class="tel">{{defaultAddress.tel}}</span>
              </div>
              <div class="address-info">
                <i class="iconfont icon-position-2"></i>
                <span> {{defaultAddress.addrProvince}} {{defaultAddress.addrCity}} {{defaultAddress.addrDistrict}} {{defaultAddress.addrDetail}} </span>
              </div>
            </div>
          </div>
          <div class="triangle">
            <div class="content"></div>
          </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="order-detail-container">
        <div class="coder-list">
          <div class="t" v-for="item in preOrderInfo.orderList" :key="item.id">
            <div class="item mb20">
              <div class="title f28">
                <i class="iconfont icon-shop f26 mr10"></i>
                <span class="f28">{{item.shop.name}}</span>
              </div>
              <div class="goods">
                <div class="t" v-for="one in item.skuList" :key="one.id">
                  <div class="info mb20">
                    <div class="pic">
                      <img class="t" :src='one.img' />
                    </div>
                    <div class="detail">
                      <p class="f28 mb24">{{one.title}}</p>
                      <div class="fc-9b mb24">
                        <span class="f24" v-if="one.color">颜色：{{one.color}}；</span>
                        <span class="f24" v-if="one.size">尺码：{{one.size}}；</span>
                      </div>
                      <div class="f28">
                        <span class="fc-pink f32">￥{{one.price}}</span>
                        <span class="fr">
                          <span class="f20">X</span>
                          <span>{{one.quantity}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="money-else">
                <div class="freight">
                  <span>运费</span>
                  <span>￥{{item.feeInfo.logisticsFee}}</span>
                </div>
                <!-- <div class="coupon">
              <text>现金券</text>
              <text>-￥{{item.feeInfo.discountAmount}}</text>
            </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 协议 -->
      <!-- <div class="protocol">
    提交订单则表示您同意
    <text>《用户购买协议》</text>
  </div> -->
      <!-- 支付 -->
      <div class="pay-container" :style="{paddingBottom: isx ? '34px' : '0'}">
        <div class="money">
          实付金额：
          <span class="fc-pink">￥{{preOrderInfo.feeInfo.amount}}</span>
        </div>
        <div class="wx-pay-con">
          <div class="wx-pay" @click="wxPay">微信支付</div>
          <!-- <form bindsubmit="saveFormId" report-submit="{{true}}" class="">
          <button formType="submit" class='btn'></button>
        </form> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      money: null,
      formIds: [],
      canPay: true,
      isx: false,
      chooseAddress: null,
      addressList: null,
      defaultAddress: null
    }
  },
  computed: {
    ...mapGetters(['preOrderInfo', 'orderAddress'])
  },
  activated() {
    let that = this
    if (this.$route.query.chooseAddress) {
      this.chooseAddress = this.$route.chooseAddress
    }
    this.$store.dispatch('GetAddressList').then(addressList => {
      that.addressList = addressList
      if (!that.orderAddress) {
        let defaultAddressArr = that.addressList.filter(addressItem => {
          return addressItem.isDefault == 1
        })
        if (defaultAddressArr.length) {
          that.defaultAddress = defaultAddressArr[0]
        }
      } else {
        that.defaultAddress = that.orderAddress
      }
    })
  },
  deactivated() {
    // 清掉下单的信息
    // this.$store.commit('SET_PREORDER_INFO', {})
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    setAddress() {
      this.$router.push({ name: 'address', query: { from: 'settle' } })
    },
    wxPay() {
      let that = this
      this.$store.dispatch('CommitOrder', this.defaultAddress.id).then(res => {
        that.$router.push({ name: 'settle', query: { amount: that.preOrderInfo.feedInfo.amount, result: 0 } })
      })
      // this.$toast('微信支付')
      // let that = this
      // this.canPay = false
      // setTimeout(() => {
      //   that.canPay = true
      // }, 2000);
      // this.$store.dispatch('CommitOrder', this.defaultAddress.id).then(res => {
      // })
    }
  }
}
</script>


