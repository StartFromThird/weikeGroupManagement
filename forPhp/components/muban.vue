<template>
  <div id="muban">
    <!-- <router-view><router-view> -->
    <h1>子组件</h1>
    <p>测试组件模板{{base}}</p>
    <el-button @click="comText">点击测试props</el-button>
    <el-button @click="emitTest">点击测试emit</el-button>
    <mu-ban-1 :base="base" @abcD="test1"></mu-ban-1>
  </div>
</template>
<script>
module.exports = {
  el: 'muban',
  name: 'muban',
  data() {
    return {
      base: "基本数据",
    }
  },
  components: {
    "mu-ban-1": httpVueLoader("./muban1.vue"),
  },
  props: {
    test: {
      type: Number,
      default: 0
    },
  },
  watch: {
    test(n) {
      this.base = {
        'test': n
      }
    }
  },
  methods: {
    test1() {
      console.log("仅emit小写均可监听");
    },
    comText() {
      console.log(this.test);
    },
    emitTest() {
      this.$emit('call-p', 'fromMuBan')
    }
  }
}
</script>
