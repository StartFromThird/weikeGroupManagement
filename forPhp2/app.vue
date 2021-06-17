<template>
  <div class="main-page">
    <div class="left-menu-wrap">
      <main-menu></main-menu>
    </div>
    <div class="right-page-wrap">
      <router-view><router-view>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "app",
  data() {
    return {
      base: "基本数据",
    };
  },
  components: {
    "main-menu": httpVueLoader("./components/menu.vue"),
  },
};
</script>
<style scoped>
.main-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}
.main-page .left-menu-wrap {
  width: 208px;
  /* width: 80px; */
  flex-basis: 208px;
  flex-shrink: 0;
  height: 100%;
  background: #fff;
}
.right-page-wrap {
  width: calc(100vw - 208px);
  flex: 1;
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
  padding: 24px;
  box-sizing: border-box;
}
</style>
