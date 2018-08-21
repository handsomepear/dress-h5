<style src="./logisticsModal.css" scoped></style>

<template>
  <div class="logistics-wrap" @click="closeModal">
    <div class="logistics-con" @click.stop>
      <!-- 顶部 -->
      <div class="top">
        <div class="head">
          <div class="title" v-if="logisticsInfo.status == 1">在途中</div>
          <div class="title" v-if="logisticsInfo.status == 2">已签收</div>
        </div>
        <div class="close-btn" @click.stop.capture="closeModal">
          <div>+</div>
        </div>
        <div class="good" @click="viewDetail(skuList[0].productId)">
          <div class="good-img">
            <image :src="skuList[0].img + '?imageslim'" />
          </div>
          <div class="desc">
            <div class="good-title">
              <div class="title">{{skuList[0].title}}</div>
              <div class="aount fr">共{{skuList.length}}件</div>
            </div>
            <div class="company">物流公司：{{logisticsInfo.expressCompany}}</div>
            <div class="code">
              <text>物流单号：{{logisticsInfo.expressNo}}</text>
              <div class="copy-btn"  v-clipboard:copy="logisticsInfo.expressNo" v-clipboard:success="onCopy">复制单号</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 物流line -->
      <div class="timeline">
        <div class="item">
          <div class="clock">
            <div class="date f26 fc-101">06-14</div>
            <div class="time f24 fc-999">12:36</div>
          </div>
          <div class="icon-con">
            <i class="icon fc-999"></i>
          </div>
          <div class="info">
            <div class="info-state fc-999">派送中</div>
            <div class="info-main fc-999">北京市海淀区皂居苗派件员：杨亚超 18911559712 正在为您派件</div>
          </div>
        </div>
        <div v-if="traces.length > 0">
          <div class="item" v-for="(item , index) in traces" :key="index">
            <div class="clock">
              <!-- <div class="date f26 fc-101">{{tools.filterDate(item.acceptTime)}}</div> -->
              <div class="date f26 fc-101">{{tools.strSlice(item.acceptTime,5,10)}}</div>
              <div class="time f24 fc-999">{{tools.strSlice(item.acceptTime,11,16)}}</div>
            </div>
            <div class="icon-con">
              <i class="icon fc-999"></i>
            </div>
            <div class="info">
              <div class="info-main fc-999">{{item.acceptStation}}</div>
            </div>
          </div>
        </div>
        <div class="fc-999 f28 no-logistics" v-if="traces.length == 0">暂时没有物流信息</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logisticsInfo: {
      type: Object,
      default: {}
    },
    skuList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      traces: []
    }
  },
  mounted() {
    this.logisticsInfo.traces.reverse()
  },
  methods: {
    viewDetail(productId) {
      this.$router.push({ name: 'goodDetail', query: { productId } })
    },
    closeModal: function() {
      this.$emit('hideLogisticsModal')
    },
    // TODO 复制单号
    onCopy(){
      this.$toast('单号复制成功')
    },
  }
}
</script>


