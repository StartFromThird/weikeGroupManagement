<template>
<div class="page free-tag-edit">
    <div class="page-head bg-grey">
      <span class="page-head-txt">批量编辑</span>
    </div>
    <div class="page-main">
      <div class="page-main-content-wrap">
        <el-form 
          label-position="top" 
          :model="info" 
          :rules="rules" 
          ref="editForm" 
          size="mini">
          <el-form-item label="标签动作" prop="action">
            <div class="tag-action-item-wrap">
              <div
                v-for="item in tagActionOptions" 
                :key="item.value"
                @click="handleClickAction(item)"
                :class="[(item.value === info.action) ? 'tag-action-item-active' : 'tag-action-item']">
                <div class="img">
                  <img :src="`../../static/image/tag/${item.img}${(item.value === info.action) ? '-active': ''}.png`" />
                </div>
                <div class="right">
                  <div>{{item.r1}}</div>
                  <div>{{item.r2}}</div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择标签" prop="tags">
            此处应有组件
            <span>温馨提示：最多可选择10个标签</span>
          </el-form-item>
          <el-form-item prop="subject">
            <div class="choose-tag" slot="label">
              <span>选择主体</span>
              <el-popover placement="right" trigger="hover">
                <div>
                  一次批量操作只能针对同一个主体下的客户标记或移除标签。
                </div>
                <img
                  class="tip"
                  slot="reference"
                  src="../../static/image/common/info.png"
                />
              </el-popover>
            </div>
            <el-select 
              v-model="info.subject" 
              placeholder="请选择">
              <el-option
                v-for="item in subOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择客户" prop="custom">
            <div>
              此处应有显示
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
module.exports = {
  name: "free-tag-list",
  data() {
    return {
      tagActionOptions: [
        {
          value: "add",
          img: "add",
          r1: "标记标签",
          r2: "给客户批量标记标签",
        },
        {
          value: "del",
          img: "del",
          r1: "移除标签",
          r2: "给客户批量移除标签",
        },
      ],
      info: {
        action: "",
        tags: [],
      },
      rules: {
        action: [
          {
            required: true,
            message: "标签动作不可为空，请选择",
            trigger: "blur",
          },
        ],
        tags: [],
        subject: [
          {
            required: true,
            message: "选择主体不可为空，请选择",
            trigger: "blur",
          },
        ],
        custom: [],
      },
      subOptions: [],
    };
  },
  created() {
    this.handleClickAction(this.tagActionOptions[0]);
    this.getTableData();
    this.getSubOptions();
  },
  methods: {
    getTableData() {},
    handleClickAction(item) {
      this.$set(this.info, "action", item && item.value);
    },
    getSubOptions() {},
  },
};
</script>
<style>
@import url("../../static/tag/tagItemList.css");
</style>
<style scoped>
@import url("../../static/tag/freeTagEdit.css");
.page.free-tag-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.free-tag-list .page-head {
  display: flex;
  align-items: center;
  height: 58px;
}
.free-tag-list .page-head .page-head-txt {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  padding-left: 24px;
  box-sizing: border-box;
}
.free-tag-list .page-main {
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
}
.free-tag-list .page-main .table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  height: 100%;
}
.free-tag-list .page-main .table-wrap .table-head {
  /* height: 64px; */
  align-items: center;
  padding: 20px 24px;
}
.free-tag-list .page-main .table-wrap .table-head .table-head-txt {
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #000000;
  line-height: 24px;
}
.free-tag-list .page-main .table-wrap .table-main {
  flex: 1;
  padding: 0 24px;
}

.free-tag-list .table-pagination-wrap {
  padding: 8px 24px 24px;
}
</style>
