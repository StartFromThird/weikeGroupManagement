<template>
  <div class="init-page">
    <div class="page-center" v-if="!isSubjectExit">
      <div class="r-1">暂无主体</div>
      <div class="r-2">请开始新增你的主体</div>
      <!-- <el-button type="primary" size="mini" @click="patchImport">批量导入</el-button> -->
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {},
  data() {
    return {};
  },
  computed: {
    isSubjectExit() {
      let isS = this.$store.state.isSubjectExit;
      if (isS) {
        let defaultS = this.$store.state.defaultSubject;
        console.log(defaultS);
        this.$router.push({
          path: defaultS.path,
          query: {
            id: defaultS.id,
            type: defaultS.type
          }
        })
      }
      return isS;
    }
  },
  created() {
  },
  mounted() {},
  watch: {},
  methods: {
    patchImport() {},
  },
  components: {},
};
</script>

<style scoped>
.init-page {
  height: 100%;
  width: 100%;
  display: flex; 
  justify-content: center;
  align-items: center;
  background: #fff;
}
.page-center {
  text-align: center;
  height: 47px;
}
.r-1 {
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  color: #000000;
  line-height: 22px;
  margin-bottom: 8px;
}
.r-2 {
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 17px;
  letter-spacing: 1px;
  /* margin-bottom: 30px; */
}
</style>
