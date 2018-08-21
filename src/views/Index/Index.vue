<style src="./index.css" scoped>
</style>

<template>
  <div id="index">
    <header>
      <van-nav-bar title="首页" fixed left-arrow @click-left="exit"></van-nav-bar>
    </header>
    <div class="product-list">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" @load="loadMoreGood" :immediate-check="immediateCheck">
          <van-cell v-for="(item, index) in productList" :key="item.id" class="d-item">
            <div class="good-item">
              <div class="img-con">
                <img :src="item.imgs[0].url + '?imageslim'" :data-product-id="item.id" @click="viewDetail(item.id)" />
              </div>
              <div class="good-detail">
                <div class="desc">
                  <div class="good-title f30 fc-101">{{item.title}}</div>
                  <div class="good-price">
                    <div class="low-price fc-pink">￥{{item.lowPrice}}</div>
                    <div class="high-price" v-if="item.highPrice != 0">原价￥{{item.highPrice}}</div>
                  </div>
                </div>
                <div class="good-else">
                  <div class="store" @click="goStore(item.shopInfo.id, item.shopInfo.title)">
                    <div class="store-avatar">
                      <img :src="item.shopInfo.logo" mode="widthFix" />
                    </div>
                    <div class="store-name f22">{{item.shopInfo.title}}</div>
                  </div>
                  <div class="action">
                    <div class="share" @click="shareHandle">
                      <img src="../../assets/img/share2.png" />
                    </div>
                    <div class="collect" :data-index="index" :data-product-id="item.id" @click="collect(item.id, index)">
                      <img v-if="item.favorite" src="../../assets/img/collected.png" />
                      <img v-else src="../../assets/img/collect.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { getStream } from '@/api/product'
import { addFavorite } from '@/api/user'
export default {
  data() {
    return {
      isLoading: false, // 下拉刷新
      immediateCheck: false,
      loading: false, // 上拉加载
      finished: false,
      productList: [],
      isRefreshStream: false,
      its: null,
      canViewDetail: true
    }
  },
  mounted() {
    let that = this
    // this.login()
    that.$store.commit('SHOW_TABBAR')
    this.getStream()
  },
  methods: {
    exit() {
      window.app_interface.onBackPressed()
    },
    // 登录
    login() {
      let that = this
      this.$store.dispatch('Login').then(() => {
        
      })
      // if (window.app_interface) {
      //   window.app_interface.getHersUserInfo('getUserInfo')
      //   window.getUserInfo = function(userInfo) {
      //     userInfo = JSON.parse(userInfo)
      //     that.$store.commit('SET_USERINFO', userInfo)
      //     that.$store
      //       .dispatch('Login', {
      //         avatar: userInfo.headUrl,
      //         gender: 2,
      //         nickName: userInfo.nickName,
      //         platform: 2, // 2 代表她社区
      //         unionId: ''
      //       })
      //       .then(() => {
      //         alert(35)
      //       })
      //       .catch(err => {
      //         alert(err)
      //       })
      //   }
      // }
    },
    onRefresh() {
      this.isRefreshStream = true
      this.getStream()
    },
    getStream() {
      let that = this
      getStream()
        .then(res => {
          that.its = null
          if (res.data.products.length == 0) {
            that.finished = true
          }
          if (that.isRefreshStream) {
            that.productList = res.data.products
            that.isLoading = false
          } else {
            that.loading = false
            that.productList.push.apply(that.productList, res.data.products)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    loadMoreGood() {
      this.isRefreshStream = false
      this.getStream()
    },
    // 收藏
    collect(productId, index) {
      let that = this
      if (this.productList[index].favorite) {
        this.$toast('您已收藏过该商品')
      } else {
        addFavorite(productId).then(res => {
          that.$toast.success('收藏成功')
          that.productList[index].favorite = true
        })
      }
    },
    goStore(shopId, shopTitle) {
      this.$router.push({ name: 'shop', query: { shopId, shopTitle } })
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId: productId } })
    },
    shareHandle() {}
  }
}
</script>