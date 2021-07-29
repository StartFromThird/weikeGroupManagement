<template>
  <div class="member-code-edit">
    <div class="page-step-title">
      <div class="step-index m-r-8">1</div>
      <div class="step-txt">基本配置</div>
    </div>
    <div>
      <el-row>
        <el-col :sm="16" :md="12" :lg="12">
          <el-form
            label-position="top"
            :model="info"
            :rules="rules"
            ref="memberCodeEditForm"
            size="mini"
          >
            <el-form-item label="分组名称" prop="group_id">
              <a-tree-select
                class="ant-select-selection"
                size="small"
                v-model="info.group_id"
                show-search
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择分组名称"
                allow-clear
                tree-default-expand-all
                :tree-data="groupTreeData"
                :replace-fields="replaceFields"
                :filter-tree-node="filterGroupTreeNode"
                treeNodeFilterProp="title"
              >
              </a-tree-select>
            </el-form-item>
            <el-form-item label="成员活码名称" prop="code_name">
              <el-input
                v-model="info.code_name"
                maxlength="10"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="code_description">
              <el-input
                v-model="info.code_description"
                maxlength="20"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="给客户标记标签" prop="tag_id">
              <select-tag
                ref="selectTag"
                :write-back-selected-tag="info.tag_arr"
                :max-tag-num="200"
              >
              </select-tag>
            </el-form-item>
            <el-form-item label="欢迎语" class="m-b-0">
              <div class="welcome-tip-txt">
                不填成员活码欢迎语，则默认发送成员欢迎语，如无成员欢迎语则发送通用欢迎语！
              </div>
              <welcome-text-and-file
                :write-back-welcome="writeBackWelcome"
                :allow-add-wechat-app-type="[0]"
              >
              </welcome-text-and-file>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="page-step-title flex-row-between">
      <div class="flex-row">
        <div class="step-index m-r-8">2</div>
        <div class="step-txt">活码规则配置</div>
      </div>
      <div class="flex-row flex-col-center" v-if="this.pageType === 'edit'">
        <el-button size="mini" @click="addRule"> 新建规则 </el-button>
        <el-popover
          placement="bottom-start"
          title="说明：引流规则只允许选择一条生效规则"
          width="280"
          trigger="hover"
          popper-class="tip-title-popover"
        >
          <img
            slot="reference"
            class="tip-icon m-l-8"
            src="../../static/image/common/info.png"
          />
        </el-popover>
      </div>
    </div>
    <!-- 新增 规则 -->
    <div v-if="this.pageType === 'add'">
      <el-row>
        <el-col :sm="16" :md="12" :lg="12">
          <member-code-rule-form ref="addMemberCodeForm" type="add">
          </member-code-rule-form>
          <div class="flex-row-end m-t-16">
            <el-button size="mini" @click="backToList">取消</el-button>
            <el-button size="mini" type="primary" @click="saveAdd"
              >提交</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 编辑 规则 -->
    <div v-if="this.pageType === 'edit'">
      <member-code-rule ref="memberCodeRule"> </member-code-rule>
      <div class="flex-row-end m-t-16">
        <el-button size="mini" @click="backToList">取消</el-button>
        <el-button size="mini" type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "member-code-edit",
  data() {
    return {
      // 页面相关
      pageType: "add",
      // 表单
      info: {
        group_id: "",
        code_name: "",
        code_description: "",
        tag_id: "",
      },
      rules: {
        group_id: [
          { required: true, message: "请选择分组名称", trigger: "blur" },
        ],
        code_name: [
          { required: true, message: "请输入成员活码名称", trigger: "blur" },
        ],
        code_description: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
      },
      // 分组名称
      treeExpandedKeys: [],
      groupTreeData: [],
      searchKey: '',
      replaceFields: {
        children: "child_group",
        title: "name",
        value: "id",
        key: "id",
      },
      // 欢迎语
      writeBackWelcome: {},

      value: "",
    };
  },
  created() {
    this.initPage();
    this.getGroupTreeData();
  },
  methods: {
    getQueryVariable,
    filterGroupTreeNode (searchKey, node) {
      if (node.data.props && node.data.props.name.includes(searchKey)) {
        return true;
      }
    },
    backToList() {
      let groupId = this.getQueryVariable("group_id");
      let pageNo = this.getQueryVariable("page_no");
      location.href = `./memberCodeList.html?back_tree_id=${groupId}&back_table_page_no=${pageNo}`;
    },
    addRule() {
      this.$refs.memberCodeRule.handleAddRule();
    },
    initPage() {
      this.pageType = this.getQueryVariable("type") || "add";
      if (this.pageType === "add") {
        this.initAddPage();
      } else if (this.pageType === "edit") {
        this.initEditPage();
      }
    },
    initAddPage() {
      this.info.group_id = this.getQueryVariable("group_id");
      this.writeBackWelcome = {
        content: "",
        emojiPopoverVisible: false,
        other_content_list: [],
      };
    },
    initEditPage() {
      let id = this.getQueryVariable("id");
      console.log("成员活码回显===", id);
      // 请求后台拿初始数据
      let info = {
        group_id: "52", //所选分组ID
        code_name: "六一儿童节", //成员活码名称
        code_description: "六一儿童节的成员活码", //成员活码描述
        is_tag: "1", //是否勾选标签，1：勾选  2：未勾选
        is_welcome: "1", //是否设置欢迎语，1：是  2：否
        tag_id: "5,6", //标签ID
        begin_time: "2021-07-14 10:00:00", //规则有效时间
        end_time: "2021-07-16 10:00:00", //规则结束时间
        rule_name: "六一活动节1", //规则名称
        rule_description: "六一儿童节", //规则描述
        rule_type: "2", //规则类型：1单人 2多人
        diversion_rule: "2", // 分流类型 ：1客户数限制  2随机
        add_people_number_limit: "100", // 添加人数限制
        scans_number_limit: 0, //扫码人数限制
        is_use: "1", // 是否启用 1启用 2未启用
        is_pass: "1", //是否自动通过 1通过 2未通过
        is_long_term: "2", //是否长期有效 1是 2否
        member_id: "76,51", //所选成员ID
        tag_arr: [
          {
            group_name: "测试",
            id: 42591,
            tag_name: "sss",
            tag_type: "HQ",
          },
          {
            group_name: "【总标A】0624",
            id: 42586,
            tag_name: "B",
            tag_type: "HQ",
          },
        ],
      };
      this.info = info;
      let writeBackWelcome = {
        content: "测试0721😀😁",
        content_id: 328,
        id: 541,
        name: "实验组",
        other_content_list: [
          {
            type: "1",
            upload_url:
              "https://wework.qpic.cn/wwpic/212678_8O69N1EhSneCHnx_1626850378/0",
          },
          {
            type: "4",
            upload_url: "",
            media_url:
              "https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=7m5EhBs11Vk59TYw6YyvIUdNOUbK-gzJDYxvKqFxZM0HVKgpY-fXu4MzXrAzQUVMyKacsGs313QW4OvCj8Ql9O19CBad01AKGtpJaR4tJq039NxWxpkt7u4qtvUfvtJECArAWXx3rXR1GoFVtl8ZekJDw3JP5u3RtKJ6GF3sZpjn-Lakn_cxofMDwny9qfv1anS8-FW31sUbwH2lii0B2g&media_id=3y66ovKwjgDFwzXgFaHKR4jCBEEs1QE-LQdy6B7Iueh4uoe1VIzagNhFewVBYzQdv",
            source_id: "26",
          },
          {
            type: "3",
            title: "qk",
            description: "https://control-workwechat-k8s.test.freshgood.cn/",
            url: "https://control-workwechat-k8s.test.freshgood.cn/",
            upload_url:
              "https://wework.qpic.cn/wwpic/196302_m4jNs13BTXCK9nS_1626850406/0",
          },
          {
            type: "2",
            upload_url:
              "https://control-workwechat-k8s.test.freshgood.cn/upload/source_2021/07/21/3FP2s6QhI1nTuyANxzU9r7vVtMdDCeim.png",
            title: "小程序标题：小程序标题：",
            url: "小程序Appid小程序Appid",
            source_id: "53",
            appid: "AppidAppidAppid",
          },
        ],
      };
      this.writeBackWelcome = writeBackWelcome;
    },
    getGroupTreeData() {
      this.groupTreeData = [
        {
          id: 31,
          name: "测试分组",
          pid: 0,
          hits_num: 0,
          child_group: [
            {
              id: 52,
              name: "测试分组-1",
              pid: 31,
              hits_num: 0,
              child_group: [
                {
                  id: 33,
                  name: "测试分组-2",
                  pid: 32,
                  hits_num: 0,
                  child_group: [
                    {
                      id: 34,
                      name: "测试分组-1-2-3",
                      pid: 33,
                      hits_num: 0,
                      child_group: [
                        {
                          id: 35,
                          name: "测试分组-1-2-3-4",
                          pid: 34,
                          hits_num: 0,
                          child_group: [
                            {
                              id: 36,
                              name: "测试分组-1-2-3-5",
                              pid: 35,
                              hits_num: 0,
                              child_group: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 37,
          name: "测试分组2",
          pid: 0,
          hits_num: 0,
          child_group: [],
        },
        {
          id: 38,
          name: "测试分组3",
          pid: 0,
          hits_num: 0,
          child_group: [],
        },
      ];
    },
    async saveAdd() {
      let addMemberCodeFormV = await this.$refs[
        "addMemberCodeForm"
      ].validateForm();
      this.$refs["memberCodeEditForm"].validate((valid) => {
        if (valid && addMemberCodeFormV) {
          let codeInfo = this.$refs.addMemberCodeForm.info;
          let tagId = this.$refs.selectTag.tags.map((ele) => ele.id).join(",");
          console.log("新增save", tagId, {
            ...this.info,
            ...codeInfo,
            ...{ tag_id: tagId },
          });
        }
      });
    },
  },

  components: {
    "member-code-rule-form": httpVueLoader(
      "./components/memberCodeRuleForm.vue"
    ),
    "member-code-rule": httpVueLoader("./components/memberCodeRule.vue"),
    "select-tag": httpVueLoader("../components/selectTag/selectTag.vue"),
    "welcome-text-and-file": httpVueLoader(
      "../components/welcomeTextAndFile/welcomeTextAndFile.vue"
    ),
  },
};
</script>
<style>
/* @import url("../../static/tag/tagItemList.css"); */
</style>
<style scoped>
@import url("../../static/memberCode/memberCodeEdit.css");
</style>
