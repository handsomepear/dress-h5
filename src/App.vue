<template>
  <div id="app">
    <van-tabbar v-model="active" v-if="isShowTabBar" :z-index="100">
      <van-tabbar-item icon="wap-home" to="/index" replace>首页</van-tabbar-item>
      <van-tabbar-item icon="cart" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/mine" replace>我的</van-tabbar-item>
    </van-tabbar>
    <!-- <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <!-- </transition> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  data() {
    return {
      isShowTabBar: true,
      active: 0
      // transitionName: 'slide-left'
    }
  },
  beforeCreate() {},
  created() {},
  destroyed() {},
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

