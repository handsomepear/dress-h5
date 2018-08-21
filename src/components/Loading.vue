<style scoped>
.loading-van {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-wrapper {
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 6px;
}
</style>


<template>
  <div class="loading-van" v-if="show">
    <div class="loading-wrapper">
      <van-loading type="spinner" color="black" />
    </div>
  </div>
</template>


<script>
export default {
  name: 'loading',
  props: {
    show: Boolean
  }
}
</script>

