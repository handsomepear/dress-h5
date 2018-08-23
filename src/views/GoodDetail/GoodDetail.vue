<style src="./goodDetail.css" scoped></style>
<template>
  <div id="good-detail">
    <van-nav-bar title="商品详情" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    <div v-if="product" class="van-page">
      <!-- 商品图 -->
      <div class="good-content">
        <div class="good-swiper">
          <van-swipe :loop="false" :vertical="false" style="height: 100%;">
            <!-- vertical style="width: 100%; height: 100%" -->
            <van-swipe-item v-for="item in product.imgs" :key="item.id">
              <!-- <div> -->
              <img :src="item.url + '?imageslim'" style="width: 10rem; height: 100%;" />
              <!-- </div> -->
            </van-swipe-item>
          </van-swipe>
          <div class="content-side">
            <div class="cart" @click="viewCart">
              <img src="../../assets/img/detail-cart.png" />
              <!-- <div wx:if="{{hasCartGoods}}" class="dot"></div> -->
            </div>
            <div class="share" @click="shareHandle">
              <img src="../../assets/img/detail-share.png" />
            </div>
          </div>
        </div>
        <div class="content-info van-hairline--bottom">
          <div class="price">
            <div class="low-price fc-pink">￥{{product.lowPrice}}</div>
            <div class="high-price" v-if="product.highPrice != 0">原价￥{{product.highPrice}}</div>
          </div>
          <span class="good-title">{{product.title}}</span>
        </div>
      </div>
      <!-- 服务 -->
      <div class="goods-service van-hairline--top-bottom" @click="showServiceModal">
        <span class="title">服务</span>
        <div class="service">
          <i class="iconfont icon-server"></i>
          包邮
        </div>
        <div class="service">
          <i class="iconfont icon-server"></i>
          72小时发货
        </div>
        <div class="service">
          <i class="iconfont icon-server"></i>
          7天无理由退货
        </div>
        <!-- 小三角 -->
        <div class="triangle">
          <div class="content"></div>
        </div>
        <div class="info-wrap" v-if="isShowServiceModal" @click.stop="hideServiceModal" data-dom="wrap">
          <div class="service-info" @click.stop>
            <div class="info-top">
              <p>服务说明</p>
              <div class="close-btn" @click.stop="hideServiceModal" data-dom="btn">
                <div>+</div>
              </div>
            </div>
            <div class="info-main">
              <div class="service-item">
                <div class="title">
                  <div class="icon">
                    <i class="iconfont icon-server"></i>
                  </div>
                  包邮
                </div>
                <p class="item-detail">无特殊说明情况下购买任意商品，均可享受包邮服务。部分地区在有特殊情况的前提下，是否享受包邮服务以商家说明为准。</p>
              </div>
              <div class="service-item">
                <div class="title">
                  <div class="icon">
                    <i class="iconfont icon-server"></i>
                  </div>
                  72小时发货
                </div>
                <p class="item-detail">卖家承诺付款后72小时内发货，预售商品除外。</p>
              </div>
              <div class="service-item">
                <div class="title">
                  <div class="icon">
                    <i class="iconfont icon-server"></i>
                  </div>
                  7天无理由
                </div>
                <p class="item-detail">
                  消费者在满足7天无理由申请条件的前提下，可以提出“7天无理由”的退货或退款申请
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="goods-param" @click="showInfoModal">
    <text class="title">参数</text>
    <div class="param">材质成分、流行元素、产地……</div>
    <div class="triangle">
      <div class="content"></div>
    </div>
    <div class="info-wrap" wx:if="{{isShowInfoModal}}" @click.stop="hideInfoModal" data-dom="wrap">
      <div class="param-info" @click.stop="stopPropagation">
        <div class="info-top">
          <text>商品参数</text>
          <div class="close-btn" @click.stop="hideInfoModal" data-dom="btn">
            <div>+</div>
          </div>
        </div>
        <div class="info-main">
          <div class="item">
            <text class="name">流行元素</text>
            <text class="content">印花</text>
          </div>
          <div class="item">
            <text class="name">袖长</text>
            <text class="content">短袖</text>
          </div>
          <div class="item">
            <text class="name">货号</text>
            <text class="content">JW11</text>
          </div>
          <div class="item">
            <text class="name">领型</text>
            <text class="content">圆领</text>
          </div>
          <div class="item">
            <text class="name">产地</text>
            <text class="content">济南</text>
          </div>
        </div>
      </div>
    </div>
  </div> -->
      <!-- 商品详情 -->
      <div class="detail">
        <div v-for="item in product.detailImgs" :key="item.id">
          <img class="detail-img" :src="item.url + '?imageslim'" />
        </div>
      </div>
      <!-- 商品操作 -->
      <div class="action van-hairline--top">
        <div class="action-l">
          <div class="action-store" @click="goStore(product.shopInfo.id, product.shopInfo.title)">
            <i class="iconfont icon-shop"></i>
            <span>店铺</span>
          </div>
          <div class="action-collect" @click="collect(product.id)">
            <i class="iconfont icon-shoucang" v-if="!product.favorite"></i>
            <img src="../../assets/img/collected.png" v-if="product.favorite" />
            <span>收藏</span>
          </div>
        </div>
        <div class="action-r" v-if="!isSoldOut">
          <div class="add-cart" @click="showSkuModal('cart')">加入购物车</div>
          <!-- 立即购买 -->
          <div class="buy" @click="showSkuModal('buy')">立即购买</div>
        </div>
        <div class="action-r" v-if="isSoldOut">
          <div class="sold-out">已下架</div>
        </div>
      </div>
      <sku-modal v-if="isShowSkuModal" @hideSkuModal="hideSkuModal" @addToCart="addToCart" @buyNow="buyNow" :skuInfo="product.skus" :type="type"></sku-modal>
      <share-panel v-if="showSelfPanel" @hideSharePanel="hideSharePanel" :shareConfig="shareConfig"></share-panel>
      <!-- <auth-modal wx:if="{{isShowAuthModal}}" bindbtnAuthHandle="btnAuthHandle" bindhideAuthModal="hideAuthModal"></auth-modal> -->
    </div>
  </div>
</template>

<script>
import SkuModal from '@/components/SkuModal/SkuModal'
import SharePanel from '@/components/SharePanel/SharePanel'
import { _getQueryString } from '@/utils/_mm'
import { getProductDetail } from '@/api/product'
import { addFavorite } from '@/api/user'
export default {
  components: {
    SkuModal,
    SharePanel
  },
  data() {
    return {
      showSelfPanel: false, // 是否显示自定义分享面板
      isSoldOut: false,
      isShowInfoModal: false,
      isShowServiceModal: false,
      isShowSkuModal: false,
      isShowAuthModal: false, // 授权弹窗
      product: null,
      type: 'cart',
      isExitSkuModal: false,
      shareConfig: null
    }
  },
  activated() {
    let that = this
    let productId = this.$route.query.productId
    that.$loading.show()
    getProductDetail(productId).then(res => {
      that.product = res.data.product
      that.isSoldOut = res.data.product.status < 1 ? true : false
      that.$loading.hide()
    })
  },
  deactivated() {
    this.$loading.hide()
    this.hideSkuModal()
  },
  methods: {
    navigateBack() {
      this.$router.go(-1)
    },
    showServiceModal() {
      this.isShowServiceModal = true
    },
    hideServiceModal() {
      this.isShowServiceModal = false
    },
    viewCart() {
      this.$router.push({ name: 'cart' })
    },
    hideSharePanel() {
      this.showSelfPanel = false
    },
    // 分享
    shareHandle() {
      let that = this
      let shareData = {
        typeId: '',
        itemId: '',
        result: '',
        shareFlags: 31,
        shareImgUrl: that.product.h5ShareImg || ''
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
            shareImg: that.product.shareImg,
            shareTitle: that.product.title,
            its: that.product.id,
            h5ShareImg: that.product.h5ShareImg
          }
        }
      }
    },
    goStore(shopId, shopTitle) {
      this.$router.push({ name: 'shop', query: { shopId, shopTitle } })
    },
    collect(productId) {
      let that = this
      if (this.product.favorite) {
        this.$toast('您已收藏过该商品')
      } else {
        addFavorite(productId).then(res => {
          that.$toast('收藏成功')
          that.product.favorite = true
        })
      }
    },
    addToCart(params) {
      let that = this
      this.$store
        .dispatch('AddCart', params)
        .then(() => {
          that.$toast('加入购物车成功')
          that.isShowSkuModal = false
        })
        .catch(err => {
          that.$toast('加入购物车失败，请重试')
        })
    },
    buyNow(skuInfo) {
      let that = this
      this.$loading.show()
      that.$router.push({
        name: 'settlement',
        query: { skuInfo: encodeURIComponent(JSON.stringify([skuInfo])) }
      })
    },
    showSkuModal(type) {
      this.type = type
      this.isShowSkuModal = true
    },
    hideSkuModal() {
      this.isShowSkuModal = false
    }
  },
  computed: {}
}
</script>
