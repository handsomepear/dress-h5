<style src="./skuModal.css" scoped>
</style>

<template>
  <div class="sku-modal" :class="isShowSkuModal ? 'show' : 'hide'" @click="closeModal">
    <div class="sku-container" :class="isShowSkuModal ? 'show': 'hide'" @click.stop="stopPropagation">
      <!-- 价格 -->
      <div class="top">
        <div class="image">
          <img :src="currentSkuImg ? currentSkuImg : skuInfo[0].imgUrl + '?imageslim'" />
        </div>
        <div class="price">
          <div class="product-title">
            <span>{{skuInfo[0].productTitle}}</span>
          </div>
          <div class="price-info" v-if="currentPrice || currentPrice === 0">
            ￥
            <span>{{currentPrice}}</span>
          </div>
          <div class="sku-info">
            <span v-if="currentColorName">{{currentColorName }}</span>
            <span v-if="currentSizeName">{{ currentSizeName && currentColorName ? '/' + currentSizeName : currentSizeName}}</span>
            <span v-if="currentInventory">库存：{{currentInventory}}</span>
          </div>
        </div>
        <div class="close-btn" @click.capture.stop="closeModal">
          <div>+</div>
        </div>
      </div>
      <!-- 颜色分类 -->
      <div class="color-classes" v-if="colorList.length > 0">
        <span class="title">颜色分类</span>
        <div class="list">
          <div class="sku-item" :class="[index == currentColor && !colorItem.disabled ? 'active' : '', colorItem.disabled ? 'disabled' : '']" v-for="(colorItem, index) in colorList" :key="colorItem.id" @click="chooseColor(index)">
            {{colorItem.color}}
          </div>
        </div>
      </div>
      <!-- 尺寸 -->
      <div class="size" v-if="sizeList.length > 0">
        <text class="title">尺寸</text>
        <div class="list">
          <div class="sku-item" :class="[index == currentSize && !sizeItem.disabled ? 'active' : '',sizeItem.disabled ? 'disabled' : '']" v-for="(sizeItem, index) in sizeList" :key="sizeItem.id" @click="chooseSize(index)">
            {{sizeItem.size}}
          </div>
        </div>
      </div>
      <!-- 数量 -->
      <div class="count" v-if="isShowQuantity">
        <span class="title">数量</span>
        <div class="count-action van-hairline--surround">
          <span class="subtract" @click="subtractNum">-</span>
          <input type="number" class="count-input van-hairline--left van-hairline--right" :value="goodQuantity" @blur="quantityChange" />
          <span class="add" @click="increaseNum">+</span>
        </div>
      </div>
      <!-- 加入购物车 -->
      <div v-if="type == 'cart'" class="add-cart" :class="btnDisabled ? 'disabled' : ''" @click="addCart">
        {{isShowQuantity?'加入购物车':'确定'}}
        <!-- <form report-submit="{{true}}" bindsubmit="saveFormId" class="form-id">
          <button form-type="submit" class="get-btn"></button>
          
        </form> -->
      </div>
      <div v-if="type == 'buy'" class="add-cart" :class="btnDisabled ? 'disabled' : ''" @click="toBuyNow">
        立即购买
        <!-- <form report-submit="{{true}}" bindsubmit="saveFormId" class="form-id">
          <button form-type="submit" class="get-btn"></button>
          
        </form> -->
      </div>
    </div>
  </div>
</template>


<script>
import { _arrQc } from '@/utils/_mm'
export default {
  props: {
    isShowSkuModal: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    skuInfo: {
      type: Array,
      default: []
    },
    goodQuantityProp: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'cart'
    },
    hideSkuModal: {
      type: Function
    },
    addToCart: {
      type: Function
    },
    buyNow: {
      type: Function
    },
    currentSku: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentColor: null, // 当前颜色index
      currentColorName: null,
      currentSize: null, // 当前尺寸index
      currentSizeName: null,
      currentPrice: null,
      btnDisabled: true,
      currentInventory: null,
      currentSkuImg: null,
      colorList: [],
      isShowQuantity: true,
      sizeList: [],
      goodQuantity: this.goodQuantityProp
    }
  },
  mounted() {
    console.log('activeted')
    this.groupSkuInfo()
    // 如果传入了SKU信息 则高亮
    if (this.currentSku) {
      this.isShowQuantity = false
    }
    if (this.currentSku && this.currentSku.productSku.inventory > 0) {
      this.highLightSku()
    }
    this.checkSku(
      {
        color: this.currentSku ? this.currentSku.productSku.color : null
      },
      'color',
      'size'
    )
    // 检测颜色
    this.checkSku(
      {
        size: this.currentSku ? this.currentSku.productSku.size : null
      },
      'size',
      'color'
    )
  },
  methods: {
    // 高亮传入的SKU信息
    highLightSku: function() {
      let that = this
      var currentColor = that.colorList.findIndex(function(colorItem) {
        return colorItem.color == that.currentSku.productSku.color
      })
      var currentSize = that.sizeList.findIndex(function(sizeItem) {
        return sizeItem.size == that.currentSku.productSku.size
      })
      var currentPrice = that.currentSku.productSku.price.mul(that.goodQuantity) // 计算价格
      var currentSkuImg = that.currentSku.productSku.imgUrl
      ;(this.currentColor = currentColor),
        (this.currentSize = currentSize),
        (this.currentPrice = currentPrice),
        (this.currentSkuImg = currentSkuImg),
        (this.currentColorName = that.currentSku.productSku.color),
        (this.currentSizeName = that.currentSku.productSku.size),
        (this.currentInventory = that.currentSku.productSku.inventory), // 库存
        (this.btnDisabled = that.goodQuantity > 0 ? false : true)
    },
    // 将颜色跟大小分离出来
    groupSkuInfo: function() {
      let that = this
      for (var v of that.skuInfo) {
        if (v.color !== '') {
          that.colorList.push({
            color: v.color,
            disabled: false
          })
        }
        if (v.size !== '') {
          that.sizeList.push({
            size: v.size,
            disabled: false
          })
        }
      }
      that.colorList = _arrQc(that.colorList, 'color')
      that.sizeList = _arrQc(that.sizeList, 'size')
    },
    closeModal: function() {
      this.$emit('hideSkuModal') // 隐藏skuModal
    },
    stopPropagation: function() {},
    // 数量加
    increaseNum: function() {
      let that = this
      if (that.currentInventory > 0) {
        if (that.goodQuantity < that.currentInventory) {
          that.goodQuantity = ++that.goodQuantity
          this.countPrice()
        } else {
          that.$toast('库存不足')
        }
      } else {
        that.$toast('请选择商品信息')
      }
    },
    // 数量减
    subtractNum: function() {
      let that = this
      if (that.currentInventory > 0) {
        if (that.goodQuantity > 1) {
          that.goodQuantity = --that.goodQuantity
        } else {
          that.$toast('不能再少了哦')
        }
      } else {
        that.$toast('请选择商品信息')
      }
      this.countPrice()
    },
    // 加入购物车
    addCart: function() {
      if (!this.btnDisabled) {
        // app.tongji('addcart')
        var currentSku = this.getCurrentSkuInfo()
        this.$emit('addToCart', {
          productSkuId: currentSku[0].id,
          quantity: this.isShowQuantity ? this.goodQuantity : 1,
          type: 1
        })
      }
    },
    // 立即购买
    toBuyNow: function() {
      // 这个buyNow是组件传过来的
      var currentSku = this.getCurrentSkuInfo()
      if (!this.btnDisabled) {
        // app.tongji('buynow')
        this.$emit('buyNow', {
          skuId: currentSku[0].id,
          quantity: this.goodQuantity
        })
      }
    },
    // 查询sku信息 禁掉无法被选的属性
    checkSku: function(sku, prop1, prop2) {
      // 匹配到含有当前属性的sku组合
      var skuResult = this.skuInfo.filter(item => {
        return item[prop1] == sku[prop1]
      })
      // 如果当前属性为null 那么就返回全部的SKU集合
      skuResult = skuResult.length ? skuResult : this.skuInfo
      // 然后筛选掉无库存的SKU信息
      skuResult = skuResult.filter(skuItem => {
        return skuItem.inventory > 0
      })
      // console.log(skuResult)
      // 商品属性只有一种（一级属性SKU 那么 就将另外的属性值设为''）
      if (skuResult.length == 1 && skuResult[0][prop2] == '') {
        this['current' + (prop2[0].toUpperCase() + prop2.slice(1)) + 'Name'] = ''
      }
      // 根据筛选之后的SKU信息 找出另外一级属性中无法被选取的组合
      var disabledPropList = this[prop2 + 'List'].diff(skuResult, prop2)
      // 然后设置他们的 disabled
      this[prop2 + 'List'].map(function(item) {
        item.disabled = disabledPropList.some(function(disabledItem) {
          return item[prop2] === disabledItem[prop2]
        })
      })
    },
    // 选择颜色
    chooseColor: function(select) {
      // var select = e.currentTarget.dataset.select
      let that = this
      if (!this.colorList[select].disabled) {
        if (this.currentColor === select) {
          this.currentColor = null // color 置空
          this.currentInventory = null // 库存置空
          //  检测颜色
        } else {
          this.currentColor = select
        }
        // 查看SKU LIST
        var currentColorName = this.currentColor !== null ? this.colorList[this.currentColor].color : null
        this.currentColorName = currentColorName
        this.checkSku(
          {
            color: currentColorName
          },
          'color',
          'size'
        )
        this.countPrice()
      }
    },

    // 选择大小
    chooseSize: function(select) {
      // var select = e.currentTarget.dataset.select
      let that = this
      if (!this.sizeList[select].disabled) {
        if (this.currentSize === select) {
          this.currentSize = null
          this.currentInventory = null
        } else {
          this.currentSize = select
        }
        // 查看SKU LIST
        var currentSizeName = this.currentSize !== null ? this.sizeList[this.currentSize].size : null
        this.currentSizeName = currentSizeName
        this.checkSku(
          {
            size: currentSizeName
          },
          'size',
          'color'
        )
        this.countPrice()
      }
    },
    // 获取到当前SKU信息
    getCurrentSkuInfo: function() {
      let that = this
      var currentSku = this.skuInfo.filter(function(skuItem) {
        return skuItem.color == that.currentColorName && skuItem.size == that.currentSizeName
      })
      return currentSku
    },
    // 计算价格
    countPrice: function() {
      var currentSku = this.getCurrentSkuInfo()
      if (currentSku.length && this.goodQuantity > 0) {
        this.btnDisabled = false
        this.currentInventory = currentSku[0].inventory
        this.currentSkuImg = currentSku[0].imgUrl
        this.currentPrice = currentSku[0].price
      } else {
        this.btnDisabled = true
        this.currentPrice = null
      }
    },
    // 数量输入
    quantityChange: function(e) {
      // var d = this.data
      var currentQuantity = e.detail.value
      this.goodQuantity =
        isNaN(parseFloat(currentQuantity)) || currentQuantity == 0 ? 1 : parseFloat(currentQuantity)
      this.countPrice()
    },
    // 收集formId
    saveFormId: function(e) {
      if (e.detail.formId != 'the formId is a mock one') {
        commonServer.saveFormId({
          formIds: [e.detail.formId],
          openId: app.globalData.openId,
          function(res) {}
        })
      }
    }
  }
}
</script>
