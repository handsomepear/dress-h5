
<style scoped></style>
<template>
  <div class="add-address">
    <van-nav-bar title="新建地址" left-arrow @click-left="navigateBack" fixed></van-nav-bar>
    <!-- <form report-submit="" bindsubmit="addAddress">
      <div class="address-new van-m-top">
        <van-field v-model="userName" label="收货人" placeholder="请输入收货人姓名" required style="line-height: 35px"/>
        <van-field v-model="telNumber" label="联系方式" placeholder="请输入联系方式" required style="line-height: 35px"/>
        <van-field v-model="telNumber" label="详细地址" placeholder="请输入详细地址" clearable required style="line-height: 35px"/>
      </div>
      <div class="add-bottom">
        <button class="btn btn-big btn-pink" form-type="submit">
          {{preOrderInfo ? '保存并使用' : '保存'}}
        </button>
      </div>
    </form> -->
    <div class="address-form van-m-top">
      <van-address-edit :area-list="areaList" :tel-validator="telTest" :address-info="editAddrInfo" :show-delete="false" @save="onSave" @delete="onDelete" :save-button-text="saveButtonText" />
    </div>
  </div>
</template>

<script>
import areaList from '@/utils/_area'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      saveButtonText: '保存',
      areaList: areaList,
      region: [],
      userName: '',
      telNumber: '',
      detailInfo: '',
      preOrderInfo: null,
      isShowWxAddrAuthModal: false
    }
  },
  activeted(){
    if(this.$route.from == 'settle') {
      this.saveButtonText = '保存并使用'
    }
  },
  deactivated() {
    this.$store.commit('SET_EDIT_ADDR_INFO', {})
  },
  computed: {
    ...mapGetters(['editAddrInfo'])
  },
  methods: {
    navigateBack() {
      this.$router.back()
    },
    // 保存地址
    onSave(params) {
      let that = this
      this.$store
        .dispatch('AddOrUpdateAddress', {
          addrCity: params.city,
          addrDetail: params.address_detail,
          addrDistrict: params.county,
          addrProvince: params.province,
          id: params.id ? params.id : 0,
          name: params.name,
          tel: params.tel
        })
        .then(() => {
          let title = params.id ? '修改成功' : '添加成功'
          that.$toast(title)
          setTimeout(() => {
            if(that.from == 'settle') {
              that.$router.go(-2)
            }else {
              that.$router.back()
            }
          }, 1500)
        })
    },
    // 电话验证
    telTest(telNumber) {
      var ph = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      var mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
      return ph.test(telNumber) || mb.test(telNumber)
    },
    // 删除
    onDelete(params) {
      let that = this
      this.$store
        .dispatch('RemoveAddress', params.id)
        .then(() => {
          that.$toast('删除成功')
          setTimeout(() => {
            that.$router.back()
          }, 1500)
        })
        .catch(err => {
          that.$toast('删除失败')
        })
    }
  }
}
</script>


