<style src="./shop.css" scoped>
</style>

<template>
  <div id="shop" class="van-top">
    <van-nav-bar :title="shopTitle" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    <div class="store">
      <!-- <div class="store-top">
        <div class="loading-con" v-if="isPullLoading">
          <div class="loading"></div>
        </div>
      </div> -->
      <div class="list-wrap">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="like-list">
            <van-list v-model="loading" :finished="finished" @load="loadMoreGood" :immediate-check="false">
              <div class="item" v-for="item in storeList" :key="item.id" @click="viewDetail(item.id)">
                <div class="img-wrap">
                  <img class="img" :src="item.imgs[0].url + '?imageslim'" />
                </div>
                <div class="txt mt10 fc-black">{{item.title}}</div>
                <div class="txt mb10 fc-pink">￥{{item.lowPrice}}</div>
              </div>
            </van-list>
          </div>
        </van-pull-refresh>
        <!-- <div class="more-loading">{{hasMore ? '加载中' : '没有更多了'}}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getProductListInShop } from '@/api/product'
export default {
  data() {
    return {
      isLoading: false,
      loading: false,
      finished: false,
      page: 1,
      pageSize: 10,
      storeList: [],
      shopId: null,
      shopTitle: null,
      shopLogo: '',
      isPullLoading: false,
      pageRecord: '',
      hasMore: true,
      isNewProductList: false // 是否是新添加的商品列表
    }
  },
  activated() {
    let that = this
    that.$store.commit('HIDE_TABBAR')
    that.shopId = that.$route.query.shopId
    that.shopTitle = that.$route.query.shopTitle
    this.getProductListInShop()
  },
  methods: {
    getProductListInShop() {
      let that = this
      getProductListInShop({
        pageRecord: that.pageRecord,
        pageSize: that.pageSize,
        shopId: that.shopId
      }).then(res => {
        if (res.data.nextPageRecord == '') {
          that.hasMore = false
          that.finished = true
        }
        if (that.isNewProductList) {
          that.storeList.push.apply(that.storeList, res.data.products)
          that.loading = false
        } else {
          that.isLoading = false
          that.storeList = res.data.products
          that.shopLogo = res.data.shopInfo.shopLogo
        }
        that.pageRecord = res.data.nextPageRecord
      })
    },
    navigateBack() {
      this.$router.go(-1)
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    loadMoreGood() {
      this.isNewProductList = true
      this.getProductListInShop()
    },
    onRefresh() {
      this.pageRecord = ''
      this.finished = false
      this.isNewProductList = false
      this.getProductListInShop()
    }
  }
}
</script>


