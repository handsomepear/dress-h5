<style src="./resultCheck.css" scoped>
</style>

<template>
  <div class="check-result van-top">
    <header>
      <van-nav-bar title="收银台" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div class="title">微信支付</div>
    <p class="p1">请先确认手机内已安装微信客户端</p>
    <div class="pay-done" @click="checkResult">付款已完成</div>
    <p class="p2">无法打开微信支付？
      <span @click="payTry">点击尝试</span>
    </p>
    <div class="cancel-pay" @click="cancelPay">取消支付</div>
  </div>
</template>

<script>
import { checkPayResult } from '@/api/order'
export default {
  data() {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    let that = this
    if (from.name == 'settlement') {
      window.location.href = decodeURIComponent(to.query.mwebUrl)
    }
    next()
  },
  deactivated () {
    this.$loading.hide()
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    payTry() {
      this.$loading.show()
      window.location.href = decodeURIComponent(this.$route.query.mwebUrl)
    },
    // 检测用户支付结果
    checkResult() {
      let that = this
      this.$loading.show()
      checkPayResult(this.$route.query.orderId).then(res => {
        that.$loading.hide()
        if (res.data.status == 1) {
          // 支付成功
          that.$router.push({ name: 'mine' })
        } else if (res.data.status == 0) {
          // 未支付（出文案提示）
          that.$toast('支付失败，请重新下单')
          setTimeout(() => {
            that.$router.go(-2)
          }, 1500)
        }
      })
    },
    // 取消支付
    cancelPay() {
      // 跳到原来的提交订单页面
      this.$router.go(-2)
      // this.$router.replace({ name: 'settlement' })
    }
  }
}
</script>
