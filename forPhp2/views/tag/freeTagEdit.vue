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
                <div class="select-tag-wrap">
                  <el-cascader
                    ref="tagCas"
                    filterable
                    v-model="info.tags"
                    :options="options"
                    :props="{ checkStrictly: true,multiple: true  }"
                    clearable
                    @click.native.stop.prevent="handleClickCascader"
                    @change="changeCas"
                  >
                  </el-cascader>
                  <!-- <div contenteditable="true" class="fake-selected-tag-cascader-box"></div> -->
                </div>
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
const options = [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }];
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
      options,
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
        custom: [{
          id: 111,
          show: '555'
        }]
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
    handleClickCascader(e) {
      let {target} = e;
      let i = parseInt(target.getAttribute("index"))
      console.log("index=====", target.getAttribute("index"));
      if (i === parseInt(i)) {
        let ar = [...this.info.tags]
        let item = ar.splice(i, 1)[0];
        this.$nextTick(()=>{
          this.info.tags = ar;
          this.changeCas(this.info.tags);
          this.$refs.tagCas.dropDownVisible = false
        })
      }
    },
    changeCas(v) {
      console.log("v========", v, v.length);
      
      let _this = this;
      let tagWrap = null
      tagWrap = document.querySelector(".table-row-tag-list-wrap") 
      const type = tagWrap ? 'change' : 'new'
      if (type === 'new') {
        tagWrap = document.createElement("div");
        tagWrap.className = 'table-row-tag-list-wrap';
      }
      let h = "";
      v.forEach((tag, index) => {
        let closeDom = document.createElement("div");
        h += `<div class="table-row-tag-item table-row-tag-item-${'HQ'}">
                <div class="left tag-txt">${tag[0]}</div>
                <div class="right">
                  <div class="right-txt tag-txt">${'总部标签21'}</div>
                  <div class="right-num right-close" index="${index}"><i class="el-icon-close" index="${index}"></i></div>
                </div>
              </div>`
      })
      tagWrap.innerHTML = h;
      if (type === 'new') {
        let iD =  document.querySelector(".el-cascader__search-input")
        document.querySelector(".el-cascader__tags").insertBefore(tagWrap, iD)
      }
    },
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
          const h = `
          <div style="position: relative;">
            <div class="el-message-box__status el-icon-warning"></div>
            <div style="margin-left: 30px;">您即将给 ${this.info.custom.length} 个客户${this.info.action === 'add' ? '标记' : '移除'}以下标签：</div>
          </div>`
          let tags = ''
          this.info.tags.forEach(tag => {
            tags += `
            <div class="table-row-tag-item table-row-tag-item-${tag.group_tag_type}>
              <div class="left tag-txt">${tag.group_name}</div>
              <div class="right">
                <div class="right-txt tag-txt">${tag.tag_name}</div>
              </div>
            </div>`
          });
          this.$confirm(`${h}<div class="table-row-tag-list-wrap">${tags}</div>`
          , '温馨提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            
          }).then(() => {
            
          }).catch(() => {
               
          });
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
@import url("../../static/tag/tagItemList.css");
</style>
<style scoped>
@import url("../../static/tag/freeTagEdit.css");
</style>
