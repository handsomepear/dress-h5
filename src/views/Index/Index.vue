<style src="./index.css" scoped>
</style>

<template>
  <div id="index" class="van-top">
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
                    <div class="share" @click="shareHandle(item.shareImg,item.title,item.id,item.h5ShareImg)">
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
    <share-panel v-if="showSelfPanel" @hideSharePanel="hideSharePanel" :shareConfig="shareConfig"></share-panel>
  </div>
</template>

<script>
import SharePanel from '@/components/SharePanel/SharePanel'
import { getStream } from '@/api/product'
import { addFavorite } from '@/api/user'
import { _getQueryString } from '@/utils/_mm'
export default {
  components: {
    SharePanel
  },
  data() {
    return {
      isLoading: false, // 下拉刷新
      immediateCheck: false,
      loading: false, // 上拉加载
      finished: false,
      productList: [],
      isRefreshStream: false,
      canViewDetail: true,
      its: null,
      showSelfPanel: false,
      shareConfig: null
    }
  },
  mounted() {
    let that = this
    this.its = this.$route.query.its
    that.$store.commit('SHOW_TABBAR')
    this.getStream()
  },
  methods: {
    exit() {
      window.app_interface.onBackPressed()
    },
    onRefresh() {
      this.isRefreshStream = true
      this.finished = false
      this.getStream()
    },
    getStream() {
      let that = this
      getStream(this.its)
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
    shareHandle(shareImg, shareTitle, its, h5ShareImg) {
      let that = this
      let shareData = {
        typeId: '',
        itemId: '',
        result: '',
        shareFlags: 31,
        shareImgUrl: h5ShareImg || ''
      }
      if (window.app_interface) {
        let version = parseFloat(_getQueryString('v'))
        if (
          version < 6.8 ||
          _getQueryString('v') == '6.8.1' ||
          _getQueryString('v') == '6.9.2' ||
          _getQueryString('v') == '7.0.2'
        ) {
          app_interface.showShareButton(JSON.stringify(shareData))
        } else {
          that.showSelfPanel = true
          that.shareConfig = {
            shareImg,
            shareTitle,
            its,
            h5ShareImg
          }
        }
      }
    },
    hideSharePanel() {
      this.showSelfPanel = false
    }
  }
}
</script>