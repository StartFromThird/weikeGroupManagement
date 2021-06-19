<template>
<div class="page free-tag-edit">
    <div class="page-head bg-grey">
      <span class="page-head-txt">批量编辑</span>
    </div>
    <div class="page-main">
      <div class="page-main-content-wrap">
        <el-row>
          <el-col :sm="24" :md="12" :lg="12">
            <el-form 
              label-position="top" 
              :model="info" 
              :rules="rules" 
              ref="freeTagEditForm" 
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
                      <div class="r1">{{item.r1}}</div>
                      <div class="r2">{{item.r2}}</div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="选择标签" prop="fakeRequire">
                此处应有组件
                <div class="choose-tag-tip">温馨提示：最多可选择10个标签</div>
              </el-form-item>
              <el-form-item prop="subject">
                <div class="choose-tag" slot="label">
                  <span>选择主体</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      一次批量操作只能针对同一个主体下的客户标记或移除标签。
                    </div>
                    <img
                      draggable="false"
                      class="tip"
                      slot="reference"
                      src="../../static/image/common/info.png"
                    />
                  </el-popover>
                </div>
                <el-select 
                  style="width: 100%;"
                  v-model="info.subject" 
                  placeholder="请选择"
                  @change="subjectChange">
                  <el-option
                    v-for="item in subOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择客户" prop="fakeRequire">
                <div style="width: 100%;">
                  <choose-customer
                    ref="tagChooseCustomer"
                    :subject="`${info.subject}`"
                    @updateselectd="updateselectd">
                  </choose-customer>  
                </div>
              </el-form-item>
              <div class="flex-row-end mt-20">
                <el-button size="mini" @click="confirmGoBack">取消</el-button>
                <el-button size="mini" type="primary" @click="save">提交</el-button>
              </div>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
module.exports = {
  name: "free-tag-list",
  data() {
    const validatePassCustoms = (rule, value, callback) => {
      if (!value || (value && !value.length)) {
        callback(new Error("选择客户不可为空，请选择"));
      } else {
        callback();
      }
    };
    const validatePassTags = (rule, value, callback) => {
      if (!value || (value && !value.length)) {
        callback(new Error("选择标签不可为空，请选择"));
      } else {
        callback();
      }
    };
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
        custom: [],
        subject: '',
        lastSubject: '',
        fakeRequire: true,
      },
      rules: {
        action: [
          {
            required: true,
            message: "标签动作不可为空，请选择",
            trigger: "blur",
          },
        ],
        tags: [
          {
            required: true,
            validator: validatePassTags,
            trigger: "change",
          },
        ],
        fakeRequire: [
          {
            required: true,
            // validator: validatePassCustoms,
            trigger: "",
          },
        ],
        subject: [
          {
            required: true,
            message: "选择主体不可为空，请选择",
            trigger: "blur",
          },
        ],
      },
      subOptions: [],
    };
  },
  created() {
    this.handleClickAction(this.tagActionOptions[0]);
    this.getSubOptions();
  },
  methods: {
    confirmGoBack() {},
    subjectChange(v) {
      this.info.subject = this.info.lastSubject
      this.$confirm("切换主体，当前选中内容将失去！", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.info.subject = v
        this.info.lastSubject = v
        let t = this.$refs.tagChooseCustomer;
        if (t) {
          t.reset()
        }
      })
      .catch(() => {
        console.log("取消切换=====");
      });

    },
    save() {
      this.$refs["freeTagEditForm"].validate((valid) => {
        console.log("save===", valid);
        if (valid) {
          if (
            !this.info.custom ||
            (this.info.custom && !this.info.custom.length)
          ) {
            this.$message.error("选择客户不可为空，请选择");
            return;
          }
        }
      });
    },
    handleClickAction(item) {
      this.$set(this.info, "action", item && item.value);
    },
    getSubOptions() {
      this.subOptions = [
        {
          id: 1,
          type: "HUMAN",
          name: "企业微信@百果园224",
        },
        {
          id: 2,
          type: "HUMAN",
          name: "企业微信@百果园339",
        },
        {
          id: 3,
          type: "HUMAN",
          name: "百果园336",
        },
        {
          id: 5,
          type: "HUMAN",
          name: "业务系统@测试",
        },
        {
          id: 7,
          type: "HUMAN",
          name: "业务系统@测试2",
        },
        {
          id: 9,
          type: "HUMAN",
          name: "业务系统@测试3",
        },
        {
          id: 11,
          type: "HUMAN",
          name: "业务系统@ddd",
        },
        {
          id: 12,
          type: "HUMAN",
          name: "企业微信@百果园",
        },
      ];
      this.$set(
        this.info,
        "subject",
        this.subOptions[0] && this.subOptions[0].id
      );
      this.$set(
        this.info,
        "lastSubject",
        this.subOptions[0] && this.subOptions[0].id
      );
    },
    updateselectd(arr) {
      this.$set(this.info, "custom", JSON.parse(JSON.stringify(arr)));
      console.log("=====", this.info.custom);
    },
  },
  components: {
    "choose-customer": httpVueLoader("./components/chooseCustomer.vue"),
  },
};
</script>
<style>
/* @import url("../../static/tag/tagItemList.css"); */
</style>
<style scoped>
@import url("../../static/tag/freeTagEdit.css");
</style>
