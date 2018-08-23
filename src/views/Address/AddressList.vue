<style src="./addressList.css" scoped>
</style>

<template>
  <div id="address-list">
    <van-nav-bar title="我的地址" left-arrow @click-left="navigateBack" fixed></van-nav-bar>
    <!-- 地址列表 -->
    <div class="van-m-top">
      <!-- 无收货地址 -->
      <div class="no-address" v-if="!hasAddress">
        <div class="inner">
          <div class="tc f32 fc-999">您的还没有收货地址哦~</div>
          <div class="btn-wrap">
            <!-- <div class="one">
              <div class="btn btn-big btn-green f30" @click="loadWxAddr">使用微信地址</div>
            </div> -->
            <div class="one">
              <div class="btn btn-big btn-pink f30" @click="toAddAddr">添加收货地址</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 收货地址列表 -->
      <div class="address-list" v-else>
        <van-radio-group class="radio-group" v-model="defaultAddrId" @change="addrDefaultChange">
          <div class="item" v-for="(item, index) in addressList" :key="index" @click="chooseAddr(item)">
            <div class="item-wrap" :class="item.isDefault == 1 ? 'act' : ''">
              <div class="title">{{item.name}} {{item.tel}}</div>
              <div class="info">
                {{item.addrProvince}} {{item.addrCity}} {{item.addrDistrict}} {{item.addrDetail}}
              </div>
              <div class="" @click.stop>
                <div class="mo ib f28 setting">
                  <van-radio :name="item.id"> {{item.isDefault ? '默认地址' :'设置为默认'}}</van-radio>
                </div>
                <div class="fr">
                  <div class="ib address-action" @click.stop="editAddr(item)">
                    <i class="iconfont icon-edit f26"></i>
                    编辑
                  </div>
                  <div class="ib address-action " @click.stop="removeAddr(item.id)">
                    <i class="iconfont icon-delete f26"></i>
                    删除
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-radio-group>
        <div class="add-btn">
          <div class="btn btn-big btn-pink" @click="toAddAddr">+ 新建地址</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import areaList from '@/utils/_area'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      from: '', // 上个页面是不是结算页面
      region: [],
      defaultAddrId: null,
      oldDefaultAddrId: null,
      customItem: '',
      preOrderInfo: [], // 下单页面传过来的参数
      hasAddress: true,
      isShowWxAddrAuthModal: false
    }
  },
  activated() {
    if (this.$route.query.from) {
      this.from = this.$route.query.from
    }
    this.getAddressList()
  },
  computed: {
    ...mapGetters(['addressList'])
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    //获取地址
    getAddressList() {
      let that = this
      this.$loading.show()
      this.$store.dispatch('GetAddressList').then(() => {
        that.$loading.hide()
        let defaultAddr = that.addressList.find(item => {
          return item.isDefault == 1
        })
        that.oldDefaultAddrId = that.defaultAddrId = defaultAddr ? defaultAddr.id : null
        if (that.addressList.length <= 0) {
          that.hasAddress = false
        } else {
          that.hasAddress = true
        }
      })
    },
    toAddAddr() {
      this.$router.push({ name: 'addAddress' })
    },
    // 选择地址
    chooseAddr(addrInfo) {
      if (this.from == 'settle') {
        this.$store.commit('CHOOSE_ADDR_INFO', addrInfo)
        this.$router.back()
      }
    },
    editAddr(editAddrInfo) {
      let that = this
      let area_code
      for (var code in areaList.county_list) {
        if (areaList.county_list[code] == editAddrInfo.addrDistrict) {
          area_code = code
          break
        }
      }
      let formatAddrInfo = {
        id: editAddrInfo.id,
        name: editAddrInfo.name,
        tel: editAddrInfo.tel,
        province: editAddrInfo.addrProvince,
        city: editAddrInfo.addrCity,
        county: editAddrInfo.addrDistrict,
        address_detail: editAddrInfo.addrDetail,
        area_code: area_code
      }
      this.$store.commit('SET_EDIT_ADDR_INFO', formatAddrInfo)
      if(this.from == 'settle') {
        this.$router.push({ name: 'addAddress', query: { from: that.from } })
      }else {
        this.$router.push({ name: 'addAddress' })
      }
    },
    removeAddr(addressId) {
      let that = this
      this.$dialog
        .confirm({
          title: '确认删除地址？'
        })
        .then(() => {
          this.$store
            .dispatch('RemoveAddress', addressId)
            .then(() => {
              that.getAddressList()
              that.$toast('删除成功')
            })
            .catch(err => {
              that.$toast('删除失败')
            })
        })
        .catch(() => {})
    },
    // 默认地址更改
    addrDefaultChange(name) {
      let that = this
      this.$loading.show()
      this.$store
        .dispatch('SetDefaultAddress', { oldId: this.oldDefaultAddrId, newId: this.defaultAddrId })
        .then(() => {
          that.$store.dispatch('GetAddressList')
          that.$loading.hide()
        })
    }
  }
}
</script>
