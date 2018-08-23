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
      <span>点击尝试</span>
    </p>
    <div class="cancel-pay">取消支付</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  activated() {
    window.app_interface.getHersUserInfo('getUserInfo')
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    // 检测用户支付结果
    checkResult() {
      window.location.href = decodeURIComponent(this.$route.query.mwebUrl)
      // this.$router.push({ name: 'mine' })
    },
    // 取消支付
    cancelPay() {
      // 跳到原来的提交订单页面
      // this.$router.go(-3)
      this.$router.replace({ name: 'settlement' })
    }
  }
}
</script>
