<style src="./sharePanel.css" scoped>
</style>

<template>
  <div class="share-panel">
    <div class="fix-bottom">
      <ul class="share-channels">
        <li @click="shareHandler(0)">
          <img src="../../assets/img/icon-share1@2x.png" alt="cicel">
          <p>朋友圈</p>
        </li>
        <li @click="shareHandler(1)">
          <img src="../../assets/img/icon-share2@2x.png" alt="friend">
          <p>微信好友</p>
        </li>
        <li @click="shareHandler(2)">
          <img src="../../assets/img/icon-share3@2x.png" alt="qq">
          <p>QQ好友</p>
        </li>
        <li @click="shareHandler(3)">
          <img src="../../assets/img/icon-share5@2x.png" alt="qzone">
          <p>QQ空间</p>
        </li>
        <li @click="shareHandler(4)">
          <img src="../../assets/img/icon-share4@2x.png" alt="weibo">
          <p>微博</p>
        </li>
      </ul>
      <div class="share-cancel" @click="closeSharePanel">取消</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hideSharePanel: {
      type: Function,
    },
    shareConfig: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  methods: {
    shareHandler(curIndex) {
      let that = this
      if (curIndex === 1) {
        var shareInfo = {
          wxMiniProgram: {
            userName: 'gh_edb79554c438',
            path: '/pages/index/index?its=' + that.shareConfig.its,
            webpageUrl: 'https://bbs.j.cn/pages/dressmalltest/',
            withShareTicket: true,
            miniprogramType: 0
          },
          shareTitle: that.shareConfig.shareTitle,
          shareImage: that.shareConfig.shareImg 
        }
        app_interface.shareAsWxMiniProgram(JSON.stringify(shareInfo))
      } else {
        var isNotFriend = {
          typeId: '',
          itemId: '',
          result: '',
          isShareImg: true,
          shareImgUrl: that.shareConfig.h5ShareImg
        }
        switch (curIndex) {
          case 0:
            app_interface.shareToCircle(JSON.stringify(isNotFriend))
            break
          case 2:
            app_interface.shareToQfriend(JSON.stringify(isNotFriend))
            break
          case 3:
            app_interface.shareToQzone(JSON.stringify(isNotFriend))
            break
          case 4:
            app_interface.shareToWeibo(JSON.stringify(isNotFriend))
            break
        }
      }
      this.closeSharePanel()
    },
    closeSharePanel() {
      this.$emit('hideSharePanel')
    }
  }
}
</script>


