<style src="./express.css" scoped>
</style>

<template>
  <div class="express van-top">
    <header>
      <van-nav-bar title="填写物流" fixed left-arrow @click-left="navigateBack"></van-nav-bar>
    </header>
    <div class="order-info" v-if="skuList" v-for="item in skuList" :key="item.id">
      <div class="info">
        <div class="pic">
          <img class="t" :src='item.img + "?imageslim"' />
        </div>
        <div class="detail">
          <div class="f28 mb10">{{item.title}}</div>
          <div class="fc-999 mb10">
            <span class="f24">颜色：{{item.color}}；尺码：{{item.size}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快递单号 -->
    <div class="express-detail">
      <div class="choose" @click="chooseExpress">
        <!-- <picker bindchange="expressChange" name="LogisticsCompany" value="expressIndex" range="expressArray" range-key="name">
            <div class="express-name">
              <span>请选择快递公司</span>
            </div>
          </picker> -->
        <div class="express-name">
          <span>请选择快递公司</span>
          <div class="picker fc-9b" v-if="express !== null">{{express.name}}</div>
        </div>
        <div class="triangle">
          <div class="content"></div>
        </div>
      </div>
      <van-popup v-model="isShowExpressPicker" position="bottom">
        <van-picker value-key="name" :columns="expressArray" :loading="isShowPickerLoading" show-toolbar @confirm="expressConfirm" @cancel="onCancel" />
      </van-popup>
      <div class="tracking-num">
        <div class="title">请填写快递单号</div>
        <div class="fill-ecode">
          <!-- <div class="scan" bindtap="scanCode">
            <i class="iconfont icon-ecode"></i>
            <span class="f24 mt10">扫描单号</span>
          </div> -->
          <input v-model="logisticsNumber" class="f28" type="number" placeholder="多行输入" />
        </div>
      </div>
      <!-- 手机号 -->
      <div class="tel-num">
        <div class="title">请填写手机号</div>
        <input v-model="telNo" class="f28" type="number" maxlength="11" placeholder="请填写您11位手机号码" />
      </div>
    </div>
    <!-- 提交快递单号 -->
    <div class="submit-express-number">
      <button class="btn btn-pink btn-big" @click="submitLogistics">提交</button>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { addReturnInfo } from '@/api/server'
export default {
  data() {
    return {
      express: null,
      logisticsNumber: '', // 物流单号
      applyNumber: null,
      telNo: '', // 手机号
      orderId: null,
      orderSkuId: null,
      skuList: null,
      logisticsInfo: null,
      isShowExpressPicker: false,
      isShowPickerLoading: false
    }
  },
  computed: {
    ...mapGetters(['returnApplyInfo', 'expressArray'])
  },
  activated() {
    this.applyNumber = this.returnApplyInfo.applyNumber
    this.skuList = this.returnApplyInfo.orderSkuList
    this.orderId = this.$route.query.orderId
    this.orderSkuId = this.$route.query.orderSkuId
  },
  methods: {
    chooseExpress() {
      let that = this
      this.isShowPickerLoading = true
      this.$store.dispatch('GetExpressCompanys').then(() => {
        that.isShowPickerLoading = false
      })
      this.isShowExpressPicker = true
    },
    expressConfirm(express) {
      this.express = express
      this.isShowExpressPicker = false
    },
    onCancel() {
      this.isShowExpressPicker = false
    },
    navigateBack() {
      this.$router.back()
    },
    submitLogistics() {
      var warn = ''
      var flag = false
      var ph = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      var lg = /^[a-z0-9A-Z]*$/
      var oLg = {
        SF: /^[0-9]{12}$/, // 顺丰
        STO: /^[0-9]{12,13}$/, // 申通
        YD: /^[\s]*[0-9]{13}[\s]*$/, // 韵达
        YTO: /^(0|1|2|3|5|6|7|8|E|D|F|G|V|W|e|d|f|g|v|w|M)[0-9]{9,17}$/, // 圆通快递
        ZTO: /^\d{12}$/, // 中通快递
        EMS: /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/, // ems
        HTKY: /^\w{12,14}$/, // 百世快递
        HHTT: /^[0-9]{12,14}$/, // 天天快递
        ZJS: /^[a-zA-Z0-9]{10}$/, // 宅急送
        RFD: /^[0-9]{13,}$/ // 如风达
      }
      if (this.express == null) {
        warn = '请选择快递公司'
      } else if (this.logisticsNumber == '') {
        warn = '请填写快递单号'
      } else if (!lg.test(this.logisticsNumber)) {
        warn = '请填写正确格式的快递单号'
      } else if (this.telNo == '') {
        warn = '请填写手机号'
      } else if (!ph.test(this.telNo)) {
        warn = '请填写正确的手机号'
      } else {
        flag = true
        addReturnInfo(
          {
            applyNumber: this.applyNumber,
            phone: this.telNo,
            companyCode: this.express.code,
            shipmentName: this.express.name,
            shipmentNumber: this.logisticsNumber
          },
          res => {
            wx.navigateBack()
          }
        )
      }

      if (!flag) {
        this.$toast(warn)
      }
    }
  }
}
</script>
