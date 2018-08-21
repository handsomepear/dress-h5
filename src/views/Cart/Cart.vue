<style src="./cart.css" scoped>
</style>

<template>
  <div id="cart">
    <van-nav-bar title="购物车" left-arrow @click-left="navigateBack" fixed></van-nav-bar>
    <div v-if="isShowCartList" class="van-m-top">
      <div class="loading-con" v-if="isPullLoading">
        <div class="loading"></div>
      </div>
      <!-- 购物车列表 -->
      <div v-if="hasCartGoods">
        <van-list class="cart-list">
          <van-cell v-for="(storeItem, storeIndex) in cartList" :key="storeItem.shopId" v-if="storeItem.productSkuInfoList.length" class="d-item">
            <div class="store-item">
              <!-- 店铺名 -->
              <div class="store-name">
                <div class="check-box" @click="selectStoreItem(storeIndex)">
                  <label for="">
                    <check-box :checked="storeItem.checked" :disabled="storeItem.storeDisabled" />
                    <!-- <van-checkbox v-model="storeItem.checked"></van-checkbox> -->
                  </label>
                </div>
                <div class="name" :data-shop-id="storeItem.shopId" :data-shop-title="storeItem.shopName" @click="goStore(storeItem.shopId, storeItem.shopName)">
                  <i class="iconfont icon-shop"></i>
                  <span>{{storeItem.shopName}}</span>
                </div>
              </div>
              <!-- 商品列表 -->
              <div class="goods-list">
                <div v-for="(skuItem, skuIndex) in storeItem.productSkuInfoList" :key="skuItem.id">
                  <div class="item" :class="(skuItem.productSku.inventory > 0 && skuItem.productSku.status >= 1) ? '':'stockout'">
                    <div class="item-wrap">
                      <div class="check-box" :data-good-index="skuIndex" :data-store-index="storeIndex" @click="selectGoodItem(skuIndex, storeIndex)">
                        <label for="">
                          <check-box :checked="skuItem.checked" :disabled="!(skuItem.productSku.inventory > 0)" />
                          <!-- <van-checkbox v-model="skuItem.checked"></van-checkbox> -->
                        </label>
                      </div>
                      <div class="good-item" :data-product-id="skuItem.productSku.productId" @click="viewDetail(skuItem.productSku.productId)">
                        <div class="good">
                          <div class="good-left">
                            <div class="image">
                              <div class="wrap"></div>
                              <img :src="skuItem.productSku.imgUrl + '?imageslim'" />
                            </div>
                          </div>
                          <div class="good-right">
                            <div class="info">
                              <span class="title">{{skuItem.productSku.productTitle}}</span>
                            </div>
                            <div class="good-sku-wrapper">
                              <div class="good-sku" :data-store-index="storeIndex" :data-good-index="skuIndex" :data-product-id="skuItem.productSku.productId" @click.stop="chooseSku(skuItem.productSku.productId,storeIndex,skuIndex )">
                                {{skuItem.productSku.color}}；{{skuItem.productSku.size}}
                                <div class="triangle">
                                  <div class="content"></div>
                                </div>
                              </div>
                            </div>
                            <div class="price">￥{{skuItem.productSku.price}}</div>
                            <div class="good-operation">
                              {{skuItem.inventory}}
                              <div v-if="skuItem.productSku.inventory > 0 && skuItem.productSku.status >= 1">
                                <div class="count van-hairline--surround">
                                  <div class="substract" :data-store-index="storeIndex" :data-good-index="skuIndex" @click.stop="subtractNum(storeIndex, skuIndex)">
                                    -
                                  </div>
                                  <span class="van-hairline--left van-hairline--right">
                                    <input type="number" :data-store-index="storeIndex" :data-good-index="skuIndex" :value="skuItem.quantity" @blur="quantityChange($event,storeIndex, skuIndex, skuItem.quantity)" @click.stop />
                                  </span>
                                  <div class="add" :data-store-index="storeIndex" :data-good-index="skuIndex" @click.stop="increaseNum(storeIndex, skuIndex)">
                                    +
                                  </div>
                                </div>
                              </div>
                              <div v-if="skuItem.productSku.status < 1">
                                <div class="stockout-tips">已下架</div>
                              </div>
                              <div v-if="skuItem.productSku.inventory <= 0 && skuItem.productSku.status >= 1">
                                <div class="stockout-tips">没货了</div>
                              </div>
                              <div class="operation">
                                <div class="delete" :data-id="skuItem.id" :data-sku-id="skuItem.productSku.id" :data-store-index="storeIndex" :data-good-index="skuIndex" @click.stop="deleteGood(skuItem.productSku.id, storeIndex, skuIndex)">
                                  <div class="delete-btn btn">
                                    <i class="iconfont icon-delete"></i>
                                  </div>
                                </div>
                                <div class="collect" :data-store-index="storeIndex" :data-good-index="skuIndex" :data-product-id="skuItem.productSku.productId" :data-id="skuItem.id" :data-sku-id="skuItem.productSku.id" @click.stop="collect(skuItem.productSku.productId,storeIndex, skuIndex, skuItem.productSku.id)">
                                  <div class="collect-btn btn">
                                    <i class="iconfont icon-move-like"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
        <!-- 合计 -->
        <div class="cart-total van-bottom">
          <!-- 全选 -->
          <div class="check-all" @click="selectAll">
            <div class="check-box">
              <label for="">
                <check-box :checked="isAllSelected" />
                <!-- <van-checkbox v-model="isAllSelected"></van-checkbox> -->
              </label>
            </div>
            全选
          </div>
          <div class="total-right">
            <!-- 合计 -->
            <div class="total-amount">
              合计：
              <span>￥{{totalPrice}}</span>
            </div>
            <!-- 结算 -->
            <div @click="settle" class="settle" :class="allQuantity > 0 ? '' : 'disabled'">
              结算({{allQuantity}})
            </div>
          </div>
        </div>
      </div>
      <div class="cart-empty" v-if="!hasCartGoods">
        <!-- 购物车图标 -->
        <div class="cart-image">
          <i class="iconfont icon-cart-3 f134 fc-999"></i>
        </div>
        <span class="empty-text">您的购物车没有商品</span>
        <div class="go-shopping">
          <div class="btn btn-pink" @click="goShopping">去逛逛</div>
        </div>
      </div>
    </div>
    <sku-modal v-if="isShowSkuModal" :skuInfo="currentProduct.skus" from="cart" @addToCart="addToCart" @hideSkuModal="hideSkuModal" :currentSku="currentSku" :goodQuantity="currentSku.quantity"></sku-modal>
    <!-- <auth-modal v-if="isShowAuthModal}}" bindbtnAuthHandle="btnAuthHandle" bindhideAuthModal="hideAuthModal"></auth-modal> -->
  </div>
</template>
<script>
import SkuModal from '@/components/SkuModal/SkuModal'

import CheckBox from '@/components/CheckBox'
import _mm from '@/utils/_mm'

import { getProductDetail } from '@/api/product'
import { addFavorite } from '@/api/user'

import { mapGetters } from 'vuex'
export default {
  components: {
    CheckBox,
    SkuModal
  },
  data() {
    return {
      checked: false,
      hasCartGoods: true, // 判断购物车是否为空
      isAllSelected: false, // 是否全选
      allQuantity: 0, // 选中商品总数量
      totalPrice: 0, // 选中商品总价格
      isShowSkuModal: false,
      currentProduct: null,
      currentSku: null,
      isPullLoading: false, // 是否下拉刷新
      canSubtract: true,
      canIncrease: true,
      isShowCartList: true,
      isShowAuthModal: false
    }
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  // keep-alive包裹的组件的生命周期，类似于onShow
  activated() {
    let that = this
    this.$loading.show()
    that.$store.dispatch('GetCartList').then(() => {
      that.$loading.hide()
      that.checkCartEmpty(that.cartList)
      that.setCartList(that.cartList, false) // 默认不选中所有购物车商品
      that.setDefaultChecked()
      that.countAllQuantity()
    })
  },
  deactivated () {
    // 清掉再次购买的商品信息
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    goShopping() {
      this.$router.push({ name: 'index' })
    },
    // 设置购物车数据的选中状态
    setCartList(cartList, isChecked) {
      var that = this
      cartList.forEach(function(storeItem) {
        if (typeof storeItem.checked == 'undefined' || storeItem.storeDisabled === false) {
          isChecked === undefined ? null : (storeItem.checked = isChecked)
        }
        storeItem.storeDisabled = true // 商店是否可选
        storeItem.productSkuInfoList.forEach(function(goodItem) {
          if (goodItem.productSku.inventory > 0 && goodItem.productSku.status >= 1) {
            // 如果传入的设置的值 那么就设置 否则就不设置
            isChecked === undefined ? null : (goodItem.checked = isChecked)
            storeItem.storeDisabled = false
          } else {
            goodItem.checked = false
          }
        })
      })
      that.isAllSelected = that.checkStoreSelect(cartList.filter(storeItem => !storeItem.storeDisabled))
    },
    // TODO 是不是需要放到vuex中
    setDefaultChecked() {},
    // 监测购物车是不是空的
    checkCartEmpty(cartList) {
      if (cartList instanceof Array) {
        var hasCartGoods = cartList.some(function(storeItem) {
          return storeItem.productSkuInfoList.length > 0
        })
        this.isShowCartList = true
        this.hasCartGoods = hasCartGoods
      }
    },
    // 选择某个店铺
    selectStoreItem: function(storeIndex) {
      var cartList = this.cartList
      if (!cartList[storeIndex].storeDisabled) {
        cartList[storeIndex].checked = !cartList[storeIndex].checked
        cartList[storeIndex].productSkuInfoList.forEach(function(goodItem) {
          if (goodItem.productSku.inventory > 0 && goodItem.productSku.status >= 1) {
            goodItem.checked = cartList[storeIndex].checked
          }
        })
        // 全选状态
        this.isAllSelected = this.checkStoreSelect(cartList.filter(storeItem => !storeItem.storeDisabled))
        this.countAllQuantity()
      } else {
        cartList[storeIndex].checked = false
      }
    },
    // 计算商品总数和总金额
    countAllQuantity: function() {
      var quantity = 0
      var totalPrice = 0
      var checkedGoodList = this.getCheckedGoodList(function(goodItem) {
        totalPrice = totalPrice.add(goodItem.productSku.price.mul(goodItem.quantity))
      })
      checkedGoodList.forEach(function(goodItem) {
        quantity += goodItem.quantity
      })
      this.allQuantity = quantity
      this.totalPrice = totalPrice
    },
    // 获取选中的商品
    getCheckedGoodList: function(cb) {
      var checkedGoodList = []
      this.cartList.forEach(function(storeItem) {
        storeItem.productSkuInfoList.forEach(function(goodItem) {
          // 筛选出选中的商品
          if (goodItem.checked) {
            checkedGoodList.push(goodItem)
            cb && cb(goodItem)
          }
        })
      })
      return checkedGoodList
    },
    // 全选
    selectAll: function(e) {
      this.isAllSelected = !this.isAllSelected
      this.setCartList(this.cartList, this.isAllSelected)
      this.countAllQuantity()
    },
    // 结算
    settle: function() {
      let that = this
      let allQuantity = this.allQuantity
      if (allQuantity > 0) {
        this.$loading.show()
        let paramList = [] // 结算订单的商品信息
        let checkedGoodList = that.getCheckedGoodList()
        checkedGoodList.forEach(function(goodItem) {
          paramList.push({
            quantity: goodItem.quantity,
            skuId: goodItem.productSku.id
          })
        })
        this.$store.dispatch('PreOrder', paramList).then(() => {
          that.$loading.hide()
          that.$router.push({ name: 'settlement' })
        })
      }
    },
    // 选择某个商品
    selectGoodItem: function(goodIndex, storeIndex) {
      // 拿到当前的商品的库存 判断有货没货 还有 要设定用户选择数量的上限
      var cartList = this.cartList
      var current = cartList[storeIndex].productSkuInfoList[goodIndex]
      // 如果库存 大于 0
      if (current.productSku.inventory > 0 && current.productSku.status >= 1) {
        current.checked = !current.checked
        // 获取到有库存的商品列表
        var canSelectList = cartList[storeIndex].productSkuInfoList.filter(function(goodItem) {
          return goodItem.productSku.inventory > 0 && goodItem.productSku.status >= 1
        })
        cartList[storeIndex].checked = this.checkStoreSelect(canSelectList)
        this.isAllSelected = this.checkStoreSelect(cartList.filter(storeItem => !storeItem.storeDisabled))
        this.countAllQuantity()
      }
    },
    // 监测选中状态
    checkStoreSelect: function(list) {
      if (list.length) {
        // todo 这里遍历可选的商品或者店铺列表会不会更好
        return list.every(function(item) {
          return item.checked
        })
      } else {
        return false
      }
    },
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    // 数量变化
    quantityChange: function(e, storeIndex, goodIndex, quantity) {
      let that = this
      let cartList = this.cartList
      let current = cartList[storeIndex].productSkuInfoList[goodIndex]
      let oldQuantity = current.quantity
      if (e.target.value > current.productSku.inventory) {
        this.$toast('超过库存数量了哦')
        current.quantity = current.productSku.inventory
      } else {
        current.quantity = isNaN(parseFloat(e.target.value)) || quantity == 0 ? 1 : parseFloat(e.target.value)
      }
      this.$store
        .dispatch('AddCart', {
          productSkuId: current.productSku.id,
          quantity: Math.abs(current.quantity - oldQuantity),
          type: current.quantity < oldQuantity ? 2 : 1
        })
        .then(() => {
          that.countAllQuantity()
        })
    },
    // 增加商品数
    increaseNum: function(storeIndex, goodIndex) {
      let that = this
      if (this.canIncrease) {
        var cartList = this.cartList
        var current = cartList[storeIndex].productSkuInfoList[goodIndex]
        this.canIncrease = false
        if (current.quantity < current.productSku.inventory) {
          this.$loading.show()
          this.$store
            .dispatch('AddCart', {
              oldProductSkuId: 0,
              productSkuId: current.productSku.id,
              quantity: 1,
              type: 1
            })
            .then(() => {
              current.quantity = ++current.quantity
              that.canIncrease = true
              that.countAllQuantity()
              that.$loading.hide()
            })
            .catch(err => {
              that.$loading.hide()
              that.canIncrease = true
            })
        } else {
          this.canIncrease = true
          this.$toast('库存不足')
        }
      }
    },
    // 减少商品数
    subtractNum: function(storeIndex, goodIndex) {
      let that = this
      if (this.canSubtract) {
        var cartList = this.cartList
        var current = cartList[storeIndex].productSkuInfoList[goodIndex]
        this.canSubtract = false
        if (current.quantity > 1) {
          this.$loading.show()
          this.$store
            .dispatch('AddCart', {
              oldProductSkuId: 0,
              productSkuId: current.productSku.id,
              quantity: 1,
              type: 2
            })
            .then(() => {
              current.quantity = --current.quantity
              that.canSubtract = true
              that.countAllQuantity()
              that.$loading.hide()
            })
            .catch(err => {
              that.$loading.hide()
              that.canSubtract = true
            })
        } else {
          this.canSubtract = true
          this.$toast('不能再少了哦')
        }
      }
    },
    deleteGood(skuId, storeIndex, skuIndex, msg = '删除成功') {
      let that = this
      this.$store.dispatch('DeleteCartGood', { skuIds: [skuId], storeIndex, skuIndex }).then(() => {
        that.checkCartEmpty(that.cartList)
        var currentList = that.cartList[storeIndex].productSkuInfoList
        // 删除之后要判断商店的选中状态
        var canSelectList = currentList.filter(function(goodItem) {
          return goodItem.productSku.inventory > 0 && goodItem.productSku.status >= 1 // 筛选库存大于0的
        })
        console.log(canSelectList)
        // 删除之后如果有库存的数组为0 那么就将当前店铺设置为不可选
        if (!canSelectList.length) {
          that.cartList[storeIndex].storeDisabled = true
        }
        console.log(that.checkStoreSelect(canSelectList))
        that.cartList[storeIndex].checked = that.checkStoreSelect(canSelectList)
        that.isAllSelected = that.checkStoreSelect(that.cartList.filter(storeItem => !storeItem.storeDisabled))
        that.countAllQuantity()
        that.$toast(msg)
      })
    },
    // 移入收藏夹
    collect(productId, storeIndex, skuIndex, skuId) {
      let that = this
      var currentList = this.cartList[storeIndex].productSkuInfoList
      addFavorite(productId)
        .then(res => {
          that.deleteGood(skuId, storeIndex, skuIndex, '移除收藏夹成功')
        })
        .catch(err => {
          that.$toast('移入收藏夹失败')
        })
    },
    chooseSku(productId, storeIndex, goodIndex) {
      let that = this
      let currentSku = this.cartList[storeIndex].productSkuInfoList[goodIndex]
      if (currentSku.productSku.status >= 1) {
        // 如果当前点击的是同一个product 那么就不需要发请求了
        if (!this.currentProduct || this.currentProduct.id != productId) {
          getProductDetail(productId)
            .then(res => {
              ;(that.currentProduct = res.data.product),
                (that.currentSku = currentSku),
                (that.isShowSkuModal = true)
            })
            .catch(err => {})
        } else {
          ;(this.isShowSkuModal = true), (this.currentSku = currentSku)
        }
      }
    },
    // 购物车添加或者更改SKU信息
    addToCart: function(params) {
      let that = this
      // 当前点击的商品的 SkuId
      var oldProductSkuId = this.currentSku.productSku.id
      var productSkuInfo = params
      if (oldProductSkuId === params.productSkuId) {
        // 添加数量
        this.$toast('未修改任何信息')
        that.hideSkuModal()
        return
      } else {
        // 更新sku 信息
        productSkuInfo.oldProductSkuId = oldProductSkuId
      }
      this.$loading.show()
      this.$store.dispatch('AddCart', productSkuInfo).then(() => {
        that.$loading.hide()
        that.$store.dispatch('GetCartList')
        that.$toast('添加购物车成功')
        that.hideSkuModal()
      }).catch(() => {
        that.$loading.hide()
      })
    },
    hideSkuModal() {
      this.isShowSkuModal = false
    },
    goStore(shopId, shopTitle) {
      this.$router.push({ name: 'shop', query: { shopId, shopTitle } })
    }
  }
}
</script>
