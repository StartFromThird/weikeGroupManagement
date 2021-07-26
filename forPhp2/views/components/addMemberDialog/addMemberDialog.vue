<template>
  <div class="add-member-dialog-com">
    <slot>
      <!-- <el-button
        class="add-member-btn"
        plain
        size="mini"
        @click="openMemberDialog"
      >
        添加成员
      </el-button> -->
      <el-input
        v-model="inputValue"
        :placeholder="inputPlaceholder"
        suffix-icon="el-icon-caret-bottom"
        readonly
        @focus="openMemberDialog"
      ></el-input>
    </slot>
    <el-dialog
      :visible.sync="dialogVisible"
      modal-append-to-body
      append-to-body
      lock-scroll
      custom-class="add-member-dialog"
    >
      <div class="add-member-dialog-main-wrap">
        <el-tabs
          v-if="headTypeArr && headTypeArr.length"
          type="card"
          v-model="activeTab"
          @tab-click="handleClickTabs"
        >
          <el-tab-pane
            v-for="item in headTypeArr"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          >
            <select-member-org-tab
              :ref="'member-org-tab-' + item.value"
              :is-multiple-selected="isMultipleSelected"
              :is-multiple-checkBox="isMultipleCheckBox"
              :param="{ type: item.value }"
              :selected-member-org="selectedMemberOrg"
              :dialog-visible="dialogVisible"
              :custom-selected-fn="customSelectedFn"
            >
            </select-member-org-tab>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChoose">取 消</el-button>
        <el-button type="primary" @click="submitConfirmChooseMember"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "add-member-dialog",
  data() {
    return {
      headTypeArr: [],
      dialogVisible: false,
      activeTab: "",
      selectedMemberOrg: [],
      inputValue: ''
    };
  },
  props: {
    inputPlaceholder: {
      type: String,
      default: '请选择',
    },
    // 右侧单选
    isMultipleSelected: {
      type: Boolean,
      default: true,
    },
    // 左侧 checkbox 控制
    isMultipleCheckBox: {
      type: Boolean,
      default: false,
    },
    writeBackSelectedMemberOrg: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 用户控制是否可选中
    customSelectedFn: {
      type: Function,
    },
    // 用户使用默认input时，依据选中成员数组，生成回显汉字
    customInputValueFn: {
      type: Function,
    },
  },
  computed: {},
  async created() {
    await this.getHeadTypeArr();
  },
  mounted() {
    window.ccc = this.$refs[`select-member-org-tab-QYWX`];
  },
  watch: {
    activeTab: {
      handler(n, o) {
        if (o) {
          this.selectedMemberOrg = JSON.parse(
            JSON.stringify(this.$refs[`member-org-tab-${o}`][0].selectedMembers)
          );
        }
      },
      immediate: true,
    },
    writeBackSelectedMemberOrg: {
      handler(n, o) {
        if (n) {
          this.selectedMemberOrg = JSON.parse(JSON.stringify(n));
          if (this.customInputValueFn) {
            this.inputValue = this.customInputValueFn(n);
          }

        }
      },
      immediate: true,
    },
  },
  methods: {
    openMemberDialog() {
      this.dialogVisible = true;
    },
    setDialogVisible(v) {
      this.dialogVisible = v;
    },
    cancelChoose() {
      this.dialogVisible = false;
      this.selectedMemberOrg = JSON.parse(
        JSON.stringify(this.writeBackSelectedMemberOrg)
      );
    },
    submitConfirmChooseMember() {
      this.selectedMemberOrg =
      this.$refs[`member-org-tab-${this.activeTab}`][0].selectedMembers || [];
      let param = JSON.parse(JSON.stringify(this.selectedMemberOrg));
      // this.inputValue = this.getShowStr(param, 3, "name");
      console.log("显示值====", param, this.inputValue);
      this.$emit("confirm", param);
      if (this.customInputValueFn) {
        this.inputValue = this.customInputValueFn(param);
      }
    },

    async getHeadTypeArr() {
      this.headTypeArr = [
        {
          label: "企业微信企业微信企业微信企业微信",
          value: "QYWX",
        },
        {
          label: "EHR字数测试字数测试字数测试",
          value: "EHR",
        },
        {
          label: "EPR",
          value: "EPR",
        },
      ];
      this.activeTab = this.headTypeArr[0].value;
    },
    dialogClosed() {
      this.headTypeArr = [];
      this.treeData = [];
    },
    async dialogOpen() {
      await this.getHeadTypeArr();
      this.treeData = await this.getOrgList(0);
    },
    handleClickTabs(v) {},
  },
  components: {
    "select-member-org-tab": httpVueLoader("../selectMemberOrgTab/selectMemberOrgTab.vue"),
  },
};
</script>
<style>
@import url("./addMemberDialog.css");
</style>