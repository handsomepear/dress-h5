<style src="./mine.css" scoped>
/* @import './mine.css'; */
</style>

<template>
  <div id="mine" class="van-bottom">
    <van-nav-bar title="我的" fixed left-arrow @click-left="exit"></van-nav-bar>
    <div class="mine-top van-top">
      <div class="toper bg-pink">
        <div class="user-info" @click="doLogin">
          <div class="avatar-con">
            <img class="avatar" v-if="userInfo" :src="userInfo.headUrl" />
            <img class="avatar" v-else src='../../assets/img/my.png' />
          </div>
          <span class="t">{{userInfo ? userInfo.nickName : '请登录'}}</span>
        </div>
        <div class="addr fr f28" @click="viewAddress">
          我的地址
          <i class="iconfont icon-position-1"></i>
        </div>
      </div>
      <div class="tab-title f32">
        <div class="tab-one" :class="isShowLike ? 'act' : ''" @click="showLikeList">
          <i class="iconfont icon-shoucang"></i>
          我的收藏
        </div>
        <div class="tab-one" :class="isShowLike ? '' : 'act'" @click="showOrderList">
          <i class="iconfont icon-order"></i>
          我的订单
        </div>
      </div>
    </div>
    <div class="list-wrap">
      <van-pull-refresh v-model="isPullLoading" @refresh="onRefresh">
        <div class="like-list" v-if="isShowLike">
          <van-list class="t" v-if="hasFavorite" v-model="isLoadingMoreFavorite" :finished="!hasMoreFavorite" :immediate-check="immediateCheck" @load="onLoadFavoriteList">
            <van-cell class="item" v-for="item in likeList" :key="item.id">
              <div class="item-wrap" :class="item.product.status < 1 ? 'stockout' : ''">
                <div class="img-wrap" :data-product-id="item.product.id" @click="viewDetail(item.product.id)">
                  <div class="wrap"></div>
                  <img class="img" :src="item.product.imgs[0].url +'?imgslim'" />
                </div>
                <span class="txt title mt10 fc-black">{{item.product.title}}</span>
                <div class="txt mb10 fc-pink">￥{{item.product.lowPrice}}</div>
                <div class="btn-wrap">
                  <div class="btn btn-info delete" :data-favorite-id="item.id" :data-product-id="item.product.id" @click="removeFavorite(item.id, item.product.id)">
                    <!-- <i class="iconfont icon-delete f26"></i> -->
                    <img class="delete-img" src="../../assets/img/delete.png" />
                  </div>
                  <div class="btn btn-info " @click="showSkuModal(item)" v-if="item.product.status >= 1">
                    <i class="iconfont icon-move-cart f48"></i>
                  </div>
                  <div v-else class="no-product">已下架</div>
                </div>
              </div>
            </van-cell>
            <div class="no-more fc-999" v-if="!hasMoreFavorite">没有更多了</div>
          </van-list>
          <div v-else>
            <div class="empty">
              <i class="iconfont icon-shoucangkongbai fc-999"></i>
              <span class="fc-999">暂时没有收藏哦</span>
            </div>
          </div>
        </div>
        <div class="coder-list" v-else>
          <van-list class="t" v-if="hasOrder" v-model="isLoadingMoreOrder" :finished="!hasMoreOrder" @load="onLoadOrderList" :immediate-check="immediateCheck">
            <van-cell class="item mb20" v-for="(item, index) in orderList" :key="item.id">
              <div class="title">
                <div class="name f28" :data-shop-id="item.shop.id" :data-shop-title="item.shop.name" @click="goStore(item.shop.id, item.shop.name)">
                  <i class="iconfont icon-shop f26 mr10"></i>
                  <span class="f28">{{item.shop.name}}</span>
                </div>
                <div class="fr fc-pink" v-if="!item.duringAfterSale && item.status == 1">
                  等待发货
                </div>
                <div class="fr fc-pink" v-if="!item.duringAfterSale && item.status == 2">
                  等待收货
                </div>
                <div class="fr fc-pink" v-if="!item.duringAfterSale && item.status == 3 || !item.duringAfterSale && item.status == 6">
                  交易成功
                </div>
                <div class="fr fc-pink" v-if="item.duringAfterSale">售后处理中</div>
                <div class="fr fc-pink" v-if="!item.duringAfterSale && item.status == 5">
                  订单关闭
                </div>
              </div>
              <div class="goods mb20">
                <div class="t" v-for="one in item.skuList" :key="one.id">
                  <div class="info mb20" @click="viewOrderDetail(item.id)">
                    <div class="pic">
                      <img class="t" :src="one.img + '?imgslim'" />
                    </div>
                    <div class="detail">
                      <div class="f28 mb10">{{one.title}}</div>
                      <div class="fc-999 mb10" style="line-height:1">
                        <span class="f24">颜色:{{one.color}};</span>
                        <span class="f24">尺码:{{one.size}};</span>
                      </div>
                      <div class="f28">
                        ￥{{one.price}}
                        <span class="fr">
                          <span class="f20">X</span>
                          <span>{{one.quantity}}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="total tr mb20">
                共{{item.quantity}}件商品 合计:
                <span class="fc-pink f32">￥{{item.price}}元</span>
              </div>
              <div class="total tr" v-if="item.status == 2">
                <div class="btn btn-small btn-info mr20" :data-order-id="item.id" :data-index="index" @click="queryLogistics(item.id, index)">
                  查看物流
                </div>
                <div class="btn btn-small btn-pink" :data-index="index" :data-order-id="item.id" @click="confirmReceive(index, item.id)">
                  确认收货
                </div>
              </div>
              <div class="total tr" v-if="item.status == 3 || item.status == 5">
                <div class="btn btn-small btn-info mr20" :data-cur-order="item" @click="divOrderDetail(item)">
                  查看详情
                </div>
                <div class="btn btn-small btn-pink" :data-cur-order="item" @click="buyAgain(item)">
                  再次购买
                </div>
              </div>
            </van-cell>
            <div class="no-more fc-999" v-if="!hasMoreOrder">没有更多了</div>
          </van-list>
          <div v-if="!hasOrder">
            <div class="empty">
              <i class="iconfont icon-group fc-999"></i>
              <span class="fc-999">暂时没有订单哦</span>
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <sku-modal v-if="isShowSkuModal" :skuInfo="currentProduct.product.skus" @hideSkuModal="hideSkuModal" @addToCart="addToCart" />
      <logistics-modal v-if="isShowLogisticsModal" @hideLogisticsModal="hideLogisticsModal" :logisticsInfo="logisticsInfo" :skuList="currentSkuList"></logistics-modal>
    </div>
  </div>

</template>


<script>
import { orderList, queryLogistics, confirmReceive } from '@/api/order'
import { getFavoritesList, batchAddCart, cancelFavorite, addCart } from '@/api/user'
import { mapGetters } from 'vuex'

import SkuModal from '@/components/SkuModal/SkuModal'
import LogisticsModal from '@/components/LogisticsModal/LogisticsModal'
export default {
  components: {
    SkuModal,
    LogisticsModal
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      message: '复制的内容',
      immediateCheck: false, // 是否首次加载就触发列表load事件
      isShowLike: false,
      isShowLogisticsModal: false, // 是否显示物流窗口
      logisticsInfo: null, // 物流信息
      currentSkuList: [], // 查看物流的订单SKU列表
      pageRecord: '', // 分页信息
      pageSize: 5,
      isRefreshOrder: true, // 是否是刷新订单列表
      isRefreshFavorite: false, // 是否是刷新订单列表
      isShowAuthModal: false, // 是否显示授权弹窗
      nextPage: '',
      hasFavorite: true,
      hasMoreFavorite: true,
      isLoadingMoreOrder: false,
      isLoadingMoreFavorite: false,
      hasOrder: true,
      hasMoreOrder: true,
      isShowSkuModal: false,
      isExitSkuModal: false,
      orderList: [], // 订单列表
      likeList: [], // 收藏列表
      currentProduct: {},
      its: 0,
      isPullLoading: false // 是否在下拉刷新
    }
  },
  computed: {
    ...mapGetters(['mineTab', 'userInfo'])
  },
  watch: {
    $route(to, from, next) {
      if (from.name == 'result') {
        this.isRefreshOrder = true
        this.pageRecord = ''
        this.getOrderList()
      }
    }
  },
  mounted() {
    this.showTab()
    this.$store.commit('SHOW_TABBAR')
    this.getOrderList()
  },
  activated() {
    this.isRefreshFavorite = true
    this.isRefreshOrder = true
    this.showTab()
  },
  methods: {
    exit() {
      window.app_interface.onBackPressed()
    },
    doLogin() {
      if (!userInfo) {
        window.app_interface.appLogin(0)
      }
    },
    onRefresh() {
      if (this.isShowLike) {
        this.isRefreshFavorite = true
        this.nextPage = ''
        this.getFavoriteList()
      } else {
        this.isRefreshOrder = true
        this.pageRecord = ''
        this.getOrderList()
      }
    },
    onLoadFavoriteList() {
      this.isRefreshFavorite = false
      this.getFavoriteList()
    },
    onLoadOrderList() {
      this.isRefreshOrder = false
      this.getOrderList()
    },
    getOrderList() {
      let that = this
      this.$loading.show()
      orderList({
        its: this.its,
        pageRecord: this.pageRecord,
        pageSize: this.pageSize
      })
        .then(res => {
          that.$loading.hide()
          if (that.isRefreshOrder) {
            ;(that.orderList = res.data.list), (that.its = 0)
            if (that.orderList.length == 0) {
              that.hasOrder = false
            } else {
              that.hasOrder = true
            }
          } else {
            that.orderList.push.apply(that.orderList, res.data.list)
          }
          if (!res.data.nextPageRecord) {
            that.hasMoreOrder = false
          }
          that.isLoadingMoreOrder = false // 控制 加载中UI 的显示
          that.pageRecord = res.data.nextPageRecord
          if (that.isPullLoading) {
            that.isPullLoading = false
          }
        })
        .catch(err => {
          that.$loading.hide()
          that.isPullLoading = false
        })
    },
    getFavoriteList() {
      let that = this
      this.$loading.show()
      getFavoritesList(this.nextPage)
        .then(res => {
          that.$loading.hide()
          if (that.isRefreshFavorite) {
            this.likeList = res.data.favoriteList
            this.isPullLoading = false
          } else {
            that.likeList.push.apply(that.likeList, res.data.favoriteList)
          }
          that.nextPage = res.data.nextPageRecord
          if (res.data.nextPageRecord == '') {
            that.hasMoreFavorite = false
          } else {
            that.hasMoreFavorite = true
          }
          that.isLoadingMoreFavorite = false
          if (that.likeList.length > 0) {
            that.hasFavorite = true
          } else {
            that.hasFavorite = false
          }
          if (that.isPullLoading) {
            that.isPullLoading = false
          }
        })
        .catch(err => {
          that.$loading.hide()
          that.isPullLoading = false
        })
    },
    showTab() {
      if (this.mineTab == 'order') {
        this.isShowLike = false
      }
      if (this.mineTab == 'like') {
        this.isShowLike = true
      }
    },
    showSkuModal: function(productInfo) {
      ;(this.currentProduct = productInfo), (this.isShowSkuModal = true)
    },
    hideSkuModal: function() {
      this.isShowSkuModal = false
    },
    addToCart(productSkuInfo) {
      let that = this
      addCart(productSkuInfo).then(res => {
        cancelFavorite({ id: that.currentProduct.id, productId: that.currentProduct.product.id }).then(
          res => {
            that.nextPage = ''
            that.$toast('添加购物车成功')
            that.hideSkuModal()
            that.getFavoriteList()
          }
        )
      })
    },
    viewOrderDetail(orderId) {
      this.$router.push({ name: 'orderDetail', query: { orderId } })
    },
    // 确认收货
    confirmReceive(orderId, index) {
      let that = this
      this.$dialog
        .confirm({
          title: '您收到货品了吗',
          confirmButtonText: '已收货',
          cancelButtonText: '未收货'
        })
        .then(() => {
          that.$loading.show()
          confirmReceive(orderId).then(res => {
            that.$loading.hide()
            that.$toast('已收货')
            that.orderList[index].status = 3 // 手动改变订单状态
          })
        })
        .catch(() => {})
    },
    buyAgain(curOrderInfo) {
      let that = this
      let skuList = []
      curOrderInfo.skuList.forEach(item => {
        skuList.push({
          productSkuId: item.skuId,
          quantity: item.quantity
        })
      })
      batchAddCart(skuList)
        .then(res => {
          that.$store.commit('SET_BUYAGAIN_LIST', curOrderInfo.skuList)
          that.$store.commit('SET_BUYAGAIN_SHOP', curOrderInfo.shop)
          that.$router.push({ name: 'cart' })
        })
        .catch(err => {})
    },
    // 查看地址
    viewAddress() {
      this.$router.push({ name: 'address' })
    },
    showLikeList() {
      this.isRefreshFavorite = true
      this.isShowLike = true
      this.$store.commit('SET_MINE_TAB', 'like')
      if (this.likeList.length == 0) {
        this.getFavoriteList()
      }
    },
    showOrderList() {
      this.isShowLike = false
      this.$store.commit('SET_MINE_TAB', 'order')
      if (this.orderList.length == 0) {
        this.getOrderList()
      }
    },
    hideLogisticsModal() {
      this.isShowLogisticsModal = false
    },
    goStore(shopId, shopTitle) {
      this.$router.push({ name: 'shop', query: { shopId, shopTitle } })
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    // 查看物流
    queryLogistics: function(orderId, index) {
      let that = this
      console.log(index)
      this.currentSkuList = this.orderList[index].skuList
      this.$loading.show()
      queryLogistics(orderId)
        .then(res => {
          that.$loading.hide()
          that.logisticsInfo = res.data
          that.isShowLogisticsModal = true
        })
        .catch(err => {
          that.$loading.hide()
        })
    },
    removeFavorite(favoriteId, productId) {
      let that = this
      cancelFavorite({ id: favoriteId, productId }).then(res => {
        that.$toast('删除成功')
        that.isRefreshFavorite = true
        that.nextPage = ''
        that.getFavoriteList()
      })
    }
  }
}
</script>
