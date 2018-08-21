<style src="./shop.css" scoped>
</style>

<template>
  <div id="shop" class="van-top">
    <van-nav-bar :title="shopTitle" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    <div class="store">
      <div class="store-top">
        <div class="loading-con" v-if="isPullLoading">
          <div class="loading"></div>
        </div>
      </div>
      <div class="list-wrap">
        <div class="like-list">
          <div class="item" v-for="item in storeList" :key="item.id" @click="viewDetail(item.id)">
            <div class="img-wrap">
              <img class="img" :src="item.imgs[0].url + '?imageslim'" />
            </div>
            <div class="txt mt10 fc-black">{{item.title}}</div>
            <div class="txt mb10 fc-pink">￥{{item.lowPrice}}</div>
          </div>
        </div>
        <div class="more-loading">{{hasMore ? '加载中' : '没有更多了'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductListInShop } from '@/api/product'
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      storeList: [],
      shopId: null,
      shopTitle: null,
      shopLogo: '',
      isPullLoading: false,
      pageRecord: '',
      hasMore: true,
      isx: false,
      isNewProductList: true // 是否是新添加的商品列表
    }
  },
  mounted() {
    let that = this
    that.$store.commit('HIDE_TABBAR')
    that.shopId = that.$route.query.shopId
    that.shopTitle = that.$route.query.shopTitle
    getProductListInShop({
      pageRecord: that.pageRecord,
      pageSize: that.pageSize,
      shopId: that.shopId
    }).then(res => {
      that.storeList = res.data.products
      that.shopLogo = res.data.shopInfo.shopLogo
    })
  },
  methods: {
    navigateBack(){
      this.$router.go(-1)
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    }
  }
}
</script>


