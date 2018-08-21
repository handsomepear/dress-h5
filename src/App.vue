<template>
  <div id="app">
    <van-tabbar v-model="active" v-if="isShowTabBar" :z-index="100">
      <van-tabbar-item icon="wap-home" to="/index" replace>首页</van-tabbar-item>
      <van-tabbar-item icon="cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/mine" replace>我的</van-tabbar-item>
    </van-tabbar>
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      isShowTabBar: true,
      active: 0,
      transitionName: 'slide-left'
    }
  },
  created() {
    let that = this
    // 登录
    window.appLoginFinish = (status, userId) => {
      if (status == 200) {
        that.active = 0
        window.app_interface.getHersUserInfo('getUserInfo')
      }
    }
    window.app_interface.getHersUserInfo('getUserInfo')
    window.app_interface.setTitleVisible(0)
    window.getUserInfo = function(userInfo) {
      userInfo = JSON.parse(userInfo)
      if (userInfo.id !== 0) {
        that.$store.dispatch('Login', userInfo)
      }
    }
  },
  watch: {
    $route(to, from) {
      let that = this
      if (to.name == 'index' || to.name == 'cart' || to.name == 'mine') {
        that.isShowTabBar = true
        if (to.name == 'index') that.active = 0
        if (to.name == 'cart') that.active = 1
        if (to.name == 'mine') that.active = 2
      } else {
        that.isShowTabBar = false
      }
    }
  },
  computed: {
    ...mapState({
      direction: state => state.element.direction
    })
  },
  methods: {
    checkLogin() {}
  }
}
</script>
<style>
#app {
  background-color: #f3f3f3;
  color: #3c3c3c;
  font-size: 24px;
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 250ms;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>

