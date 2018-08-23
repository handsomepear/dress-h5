<style src="./payResult.css" scoped>
</style>

<template>
  <div class="settle-result van-top">
    <header>
      <van-nav-bar title="支付结果" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div class="result-desc">
      <i class="iconfont icon-success"></i>
      <span class="desc" v-if="result!==0">支付成功</span>
    </div>
    <!-- <div class="settle-price">￥{{price}}</div> -->
    <div class="settle-price">￥100</div>
    <div class="button-group">
      <div class="btn btn-pink" @click="viewOrderList">查看订单</div>
      <div class="btn btn-pink" @click="continueStroll">继续逛逛</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      price: '',
      result: 0
    }
  },
  // TODO 支付成功之后 会返回支付结果
  activated() {
    this.price = this.$route.query.amount
    this.result = this.$route.query.result
  },
  methods: {
    navigateBack(){
      this.$router.back()
    },
    // 继续逛逛
    continueStroll() {
      this.$router.replace({ name: 'index' })
    },
    viewOrderList() {
      this.$router.replace({ name: 'mine' })
    }
  }
}
</script>


