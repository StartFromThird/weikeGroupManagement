<template>
  <div>
    <h1>孙组件</h1>
    <p>{{base}}</p>
    <el-button @click="comText">点击测试props</el-button>
    <el-button @click="emitTest">点击测试emit</el-button>
  </div>
</template>
<script>
module.exports = {
  name: 'muban1',
  data() {
    return {
      base: "基本数据",
    }
  },
  props: {
    base: {
      type: Object,
      default: () => {}
    },
  },
  methods: {
    comText() {
      console.log(this.base);
    },
    emitTest() {
      this.$emit('abcd', 'fromMuBan')
    }
  }
}
</script>