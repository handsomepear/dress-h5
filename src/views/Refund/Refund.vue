<style src="./refund.css" scoped>
</style>

<template>
  <!-- 退款申请 -->
  <div class="refund van-top">
    <header>
      <van-nav-bar title="申请售后" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <!-- 退款的订单信息 -->
    <div class="order-info" v-if="serviceInfo" v-for="item in serviceInfo.skuList" :key="item.id">
      <div class="info">
        <div class="pic">
          <img class="t" :src='item.img + "?imageslim"' />
        </div>
        <div class="detail">
          <p class="f28 mb10">{{item.title}}</p>
          <div class="fc-999 mb10">
            <span class="f24">颜色：{{item.color}}；尺码：{{item.size}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 退款信息 -->
    <div class="refund-info">
      <div class="reason">
        <div class="reason-info" @click="chooseReason">
          请选择原因
          <div class="picker fc-9b" v-if="reason !== null">{{reason.text}}</div>
        </div>
        <van-popup v-model="showReasonPicker" position="bottom">
          <van-picker @confirm="reasonPickerConfirm" @cancel="onCancel" :columns="refundReason" show-toolbar>
          </van-picker>
        </van-popup>
        <div class="triangle">
          <div class="content"></div>
        </div>
      </div>
      <div class="quantity" v-if="serviceInfo.serviceType != 0">
        申请件数：
        <div class="count">
          <div class="substract" @click="subtractNum">-</div>
          <input type="number" v-model="quantity" @blur="quantityChange" />
          <div class="add" @click="increaseNum">+</div>
        </div>
        <span class="f28" style="color: #9b9b9b">（最多可申请{{serviceInfo.skuList[0].quantity}}件）</span>
      </div>
      <div class="money">
        退款金额：
        <span class="fc-pink">￥{{serviceInfo.price ? serviceInfo.price : returnPrice}}</span>
      </div>
    </div>
    <!-- 问题描述 -->
    <div class="issue-desc">
      <div class="title">
        请填写问题描述
        <span>（选填）</span>
      </div>
      <!-- <textarea value="{{serviceInfo.detailDesc}}" id="" cols="30" rows="10" name="problemDesc" placeholder="多行输入"></textarea> -->
      <van-field type="textarea" class="issue-text" placeholder="多行输入" rows="3" autosize v-model="problemDesc" />
    </div>
    <!-- 上传凭证 -->
    <div class="post-img">
      <div class="title">
        上传凭证
        <span>（选填）</span>
      </div>
      <div class="post-container">
        <div v-if="proofImgList.length > 0" class="proof-img" v-for="(proofImgItem, proofImgIndex) in proofImgList" :key="proofImgIndex">
          <img :src="proofImgItem" />
        </div>
        <div class="post-btn" v-if="proofImgList.length < 5" @click="uploadsImg">
          <!-- <input type="file"> -->
          <i class="iconfont icon-camera"></i>
          <span>选择文件</span>
          <input type="file" id="upload-btn" @change="upladsImgChange" accept="image/png,image/jpg" style="display: none">
        </div>
      </div>
    </div>
    <!-- 提交按钮 -->
    <div class="apply-con">
      <div class="submit-btn apply" @click="submitService">
        提交
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addApply } from '@/api/server'
import fileUpload from '@/utils/_qiniu'
export default {
  data() {
    return {
      showReasonPicker: false,
      proofImgList: [], // 凭证图片
      refundReason: [],
      formIds: [],
      receivedRefundArr: [
        {
          id: 1,
          text: '未收到货（含少发/漏发/错发）'
        },
        {
          id: 2,
          text: '商品描述不符'
        },
        {
          id: 3,
          text: '质量问题'
        },
        {
          id: 4,
          text: '包装/商品破损'
        },
        {
          id: 5,
          text: '商家发货慢'
        }
      ], // 收货后仅退款
      receivedRefundSaleArr: [
        {
          id: 6,
          text: '7天无理由'
        },
        {
          id: 7,
          text: '商品描述不符'
        },
        {
          id: 8,
          text: '质量问题'
        },
        {
          id: 9,
          text: '包装/商品破损'
        },
        {
          id: 10,
          text: '商家发货慢'
        }
      ], // 收货后退款退货
      notSendRefundArr: [
        {
          id: 11,
          text: '不想买了'
        },
        {
          id: 12,
          text: '选错了/订单信息错误'
        },
        {
          id: 13,
          text: '商家发货慢'
        }
      ], // 未发货退款
      reason: null,
      quantity: 1,
      chooseImgCount: 5,
      returnPrice: null,
      problemDesc: ''
    }
  },
  computed: {
    ...mapGetters(['serviceInfo'])
  },
  mounted() {
    let serviceInfo = this.serviceInfo
    if (serviceInfo) {
      var serviceType = serviceInfo.serviceType
      if (serviceType == 0) {
        // 未收货仅退款
        this.refundReason = this.notSendRefundArr
        // this.pageTitle = '退款申请'
      }
      if (serviceType == 1) {
        // 已发货仅退款
        this.refundReason = this.receivedRefundArr
        // this.pageTitle = '退款申请'
      }
      if (serviceType == 2) {
        // 退货退款
        this.refundReason = this.receivedRefundSaleArr
        // this.pageTitle = '退货申请'
      }
      this.quantity = this.serviceInfo.skuList[0].quantity
      this.calculatePrice()
    }
  },
  destroyed() {
    this.$store.commit('SET_SERVICE_INFO', null)
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    chooseReason() {
      this.showReasonPicker = true
    },
    onCancel() {
      this.showReasonPicker = false
    },
    reasonPickerConfirm(reason) {
      this.showReasonPicker = false
      this.reason = reason
    },
    increaseNum: function() {
      let that = this
      if (this.quantity >= this.serviceInfo.skuList[0].quantity) {
        this.$toast(`最多可申请${this.serviceInfo.skuList[0].quantity}件哦`)
      } else {
        this.quantity = ++this.quantity
      }
      this.calculatePrice()
    },
    subtractNum: function() {
      if (this.quantity <= 1) {
        this.$toast('不能再少了哦')
      } else {
        this.quantity = --this.quantity
      }
      this.calculatePrice()
    },
    // 计算价格
    calculatePrice: function() {
      this.returnPrice = parseFloat(this.serviceInfo.skuList[0].price).mul(this.quantity)
    },
    // 上传凭证
    uploadsImg() {
      document.getElementById('upload-btn').click()
    },
    upladsImgChange(e) {
      let that = this
      let file = e.target.files[0]
      fileUpload(this, file, function(res) {
        that.proofImgList.push(res)
      })
    },
    // 仅退款
    submitService: function() {
      let that = this
      if (this.reason === null) {
        this.$toast('请选择退款原因')
      } else {
        this.$loading.show()
        addApply({
          applyType: that.serviceInfo.serviceType,
          detailDesc: that.problemDesc, // 问题详细描述
          orderId: that.serviceInfo.id,
          orderNo: that.serviceInfo.orderNo,
          orderSkuId: that.serviceInfo.isSingle ? that.serviceInfo.skuList[0].id : 0,
          proofUrl: that.proofImgList.join(','),
          quantity: that.quantity || 0,
          reasonId: that.reason.id // 退款原因ID
        })
          .then(res => {
            that.$loading.hide()
            // 提交成功
            that.$toast('申请成功')
            setTimeout(() => {
              that.$router.back()
            }, 1500)
          })
          .catch(err => {
            that.$loading.hide()
          })
      }
    },
    quantityChange() {
      if (this.quantity > this.serviceInfo.skuList[0].quantity) {
        this.$toast(`最多可申请${d.serviceInfo.skuList[0].quantity}件哦`)
        this.quantity = this.serviceInfo.skuList[0].quantity
      }
      if (this.quantity <= 0) {
        this.$toast('不能再少了哦')
        this.quantity = 1
      }
      this.calculatePrice()
    }
  }
}
</script>


