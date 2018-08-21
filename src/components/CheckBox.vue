
<style>
#checkbox .item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border: 2px solid #aaa;
  background-color: #fff;
  border-radius: 50%;
  color: #fff;
  box-sizing: border-box;
}

#checkbox .checked {
  border-color: #ff6480;
  font-size: 35px;
}

</style>

<template>
  <div id="checkbox">
    <!--  -->
    <div class="item" :class = "checked && !disabled ? 'checked' : ''">
      <van-icon class="check-icon" name="checked" size="18" color="#FF6480" v-if="checked && !disabled"></van-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  }
}
</script>

