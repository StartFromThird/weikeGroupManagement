<template>
  <div class="member-code-rule">
    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      max-height="455px"
    >
      <el-table-column label="规则名称" prop="rule_name" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="rule_type_N"
        width="70px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="使用成员" prop="member_arr_N">
        <template slot-scope="scope">
          <div
            @click="showMemberDialog"
            class="overflow-ellipsis color-primary cursor-pointer"
          >
            {{ scope.row.member_arr_N }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="分配客流规则"
        prop="diversion_rule_N"
        width="110px"
      >
      </el-table-column>
      <el-table-column
        label="单客户扫码次数上限"
        prop="diversion_rule_N"
        width="150px"
      >
      </el-table-column>
      <el-table-column label="单成员添加人数上限" prop="diversion_rule_N" width="140px">
      </el-table-column>
      <el-table-column label="自动通过" width="80px" prop="is_pass_N">
      </el-table-column>
      <el-table-column
        label="活码有效时间"
        show-overflow-tooltip
        prop="effective_time_N"
        min-width="102px"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        show-overflow-tooltip
        prop="create_time"
      >
      </el-table-column>
      <el-table-column label="配置状态" width="80px">
        <template slot-scope="scope">
          <el-switch
            size="mini"
            v-model="scope.row.is_use"
            active-value="1"
            inactive-value="2"
            @change="isUseChange(scope.row, scope.index)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handleListItemEdit(scope.row, scope.index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click="handleListItemDel(scope.row, scope.index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pagination-wrap flex-row-end p-t-16">
      <el-pagination
        v-if="tableData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNo"
      >
      </el-pagination>
    </div>
    <el-dialog title="配置引流规则" :visible.sync="dialogVisible" width="568px">
      <member-code-rule-form 
        ref="memberCodeRuleForm"
        :write-back-rule="currentRule" 
        :type="dialogType">
      </member-code-rule-form>
      <span slot="footer" class="dialog-footer">
        <!-- dialogVisible = false -->
        <el-button size="mini" @click="closeMemberCodeRuleForm">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="使用成员"
      :visible.sync="memberDialogVisible"
      width="580px"
      custom-class="member-code-edit-rule-member-dialog"
    >
      <div class="list-wrap">
        <div
          class="list-item"
          v-for="(item, index) in ruleMemberData"
          :key="item.name + index"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="table-pagination-wrap flex-row-end p-t-16">
        <el-pagination
          mini
          v-if="ruleMemberData.length"
          @size-change="handleRuleMemberSizeChange"
          @current-change="handleRuleMemberCurrentChange"
          :current-page="ruleMemberPageNo"
          :page-sizes="ruleMemberPageSizes"
          :page-size="ruleMemberPageSize"
          layout="total, sizes, prev, pager, next"
          :total="ruleMemberTotalNo"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "member-code-rule",
  props: {
    // info: {
    //   type: Object,
    //   default: function () {
    //     return {};
    //   },
    // },
    // rules: {
    //   type: Object,
    //   default: function () {
    //     return {};
    //   },
    // },
  },
  data() {
    return {
      dialogType: "",
      baseRule: {
        rule_name: "",
        rule_type: "1",
        member_id: "",
        diversion_rule: "1",
        scans_number_limit: "",
        add_people_number_limit: "",
        is_pass: "1",
        is_long_term: "1",
        timeRange: [],
        is_use: "1",
      },
      currentRule: {},
      dialogVisible: false,
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      pageSizes: [10, 15, 20],
      totalNo: 0,
      ruleTypeOption: [
        {
          value: "1",
          label: "单成员",
        },
        {
          value: "2",
          label: "多成员",
        },
      ],
      longTermOption: [
        {
          value: "1",
          label: "长期有效",
        },
        {
          value: "2",
          label: "有效时间",
        },
      ],
      diversionOption: [
        {
          value: "1",
          label: "客户数限制",
        },
        {
          value: "2",
          label: "随机",
        },
      ],
      memberDialogVisible: false,
      // 成员弹窗
      ruleMemberData: [],
      ruleMemberPageSize: 10,
      ruleMemberPageNo: 1,
      ruleMemberPageSizes: [10, 15, 20],
      ruleMemberTotalNo: 0,
      id: ''
    };
  },
  async created() {
    this.initRuleTable();
  },
  methods: {
    closeMemberCodeRuleForm() {
      this.$refs.memberCodeRuleForm.resetFormFields();
      this.dialogVisible = false;
    },
    initRuleTable() {
      this.pageNo = 1;
      this.ruleMemberPageNo = 1;
      this.id = this.getQueryVariable("id");
      this.getTableData();
    },
    getQueryVariable,
    showMemberDialog() {
      this.ruleMemberPageNo = 1;
      this.getRuleMemberTableData();
      this.memberDialogVisible = true;
    },
    getRuleMemberTableData() {
      this.ruleMemberData = [
        {
          name: "林金涛",
          member_id: 12,
          parent_name: "父节点",
        },
        {
          name: "陈业",
          member_id: 13,
          parent_name: "父节点",
        },
        {
          name: "文",
          member_id: 14,
          parent_name: "父节点",
        },
      ];
      this.ruleMemberTotalNo = 3;
    },
    handleAddRule() {
      this.dialogType = "add";
      this.currentRule = { ...this.baseRule };
      this.$nextTick(() => {
        this.$refs.memberCodeRuleForm.ruleFormClearValidate();
      });
      this.dialogVisible = true;
    },
    async submit() {
      let check = await this.$refs.memberCodeRuleForm.validateForm();
      // 调后台存规则
      // this.pageNo = 1;
      // this.getTableData();
    },
    getTableData() {
      let param = {
        id: this.id,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      let res = {
        current_page: "1",
        total_page_num: 3,
        rule_list: [
          {
            id: 29,
            rule_name: "1六一活动节1",
            rule_type: "多人",
            qw_config_id: "7d1c537d7fdf7f15123b919b855fc9a7",
            diversion_rule: "客户数限制",
            add_people_number_limit: "100",
            scans_number_limit: "0",
            begin_time: "2021-07-14 10: 00: 00",
            end_time: "2021-07-20 10: 00: 00",
            is_use: "2",
            is_pass: "是",
            is_long_term: "2",
            create_time: "2021-07-20 16: 10: 48",
            effective_time: "2021-07-14 10: 00: 00至2021-07-20 10: 00: 00",
            member_arr: [
              {
                name: "林金涛",
                member_id: 12,
                parent_name: "父节点",
              },
              {
                name: "陈业",
                member_id: 13,
                parent_name: "父节点",
              },
              {
                name: "文",
                member_id: 14,
                parent_name: "父节点",
              },
            ],
          },
          {
            id: 30,
            rule_name: "2六一活动节31",
            rule_type: "2",
            qw_config_id: "8255bd0950a26d21bf84878a2ea45d90",
            diversion_rule: "2",
            add_people_number_limit: "",
            scans_number_limit: "",
            begin_time: "2021-03-04 00: 00: 00",
            end_time: "2021-03-09 00: 00: 00",
            is_use: "2",
            is_pass: "2",
            is_long_term: "1",
            create_time: "2021-07-20 16: 53: 03",
            effective_time: "长期有效",
            member_arr: [
              {
                name: "林金涛",
                member_id: 12,
                parent_name: "父节点",
              },
              {
                name: "陈业",
                member_id: 13,
                parent_name: "父节点",
              },
              {
                name: "",
                member_id: 14,
                parent_name: "父节点",
              },
            ],
          },
          {
            id: 31,
            rule_name: "3六一活动节313",
            rule_type: "1",
            qw_config_id: "d68846b38bbbdbf2ca2da5a1243c71b0",
            diversion_rule: "1",
            add_people_number_limit: "",
            scans_number_limit: "",
            begin_time: "2021-03-04 00: 00: 00",
            end_time: "2021-03-09 00: 00: 00",
            is_use: "1",
            is_pass: "1",
            is_long_term: "1",
            create_time: "2021-07-20 16: 53: 21",
            effective_time: "长期有效",
            member_arr: [],
          },
        ],
      };
      let tableData = res.rule_list.map((ele) => {
        let formatEle = {
          ...ele,
          member_arr_N: "--",
          rule_type_N:
            ele.rule_type === "1"
              ? "单成员"
              : ele.rule_type === "2"
              ? "多成员"
              : "--",
          diversion_rule_N:
            ele.diversion_rule === "1"
              ? "客户数限制"
              : ele.diversion_rule === "2"
              ? "随机"
              : "--",
          is_pass_N:
            ele.is_pass === "1" ? "是" : ele.is_pass === "2" ? "否" : "--",
          effective_time_N:
            ele.is_long_term === "1"
              ? "长期有效"
              : ele.is_long_term === "2"
              ? `${ele.begin_time} 至 ${ele.end_time}`
              : "--",
        };
        if (
          formatEle.member_arr &&
          Array.isArray(formatEle.member_arr) &&
          formatEle.member_arr.length
        ) {
          let memberIdArr = [];
          formatEle.member_arr_N = formatEle.member_arr
            .map((m) => {
              memberIdArr.push(m.id || m.member_id);
              return (m.name || "")
            })
            .join(",");

            formatEle.member_id = memberIdArr.join(",");

        }
        return formatEle;
      });
      // tableData = [...tableData, ...tableData, ...tableData, ...tableData];
      this.tableData = tableData;
      this.totalNo = res.total_page_num;
    },
    isUseChange(row, index){
      let changed = row.is_use;
      // 调后台 改状态
      // 成功回调刷新 this.getTableData()
      // 失败要把 row.is_use 状态改回来
      if (row.is_use === '1') {
        this.$message.success('已开启，引流规则只允许选择一条生效规则！');
      }
    },
    handleListItemEdit(row, index) {
      console.log("cE====", row);
      this.dialogType = "edit";
      this.currentRule = { ...this.baseRule, ...row };
      this.$nextTick(() => {
        this.$refs.memberCodeRuleForm.ruleFormClearValidate();
      });
      this.dialogVisible = true;
    },
    handleListItemDel(row, index) {},
    handleRuleMemberSizeChange(val) {
      this.ruleMemberPageSize = val;
      this.ruleMemberPageNo = 1;
      this.getTableData();
    },
    handleRuleMemberCurrentChange(val) {
      this.ruleMemberPageNo = val;
      this.getRuleMemberTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getTableData();
    },
  },

  components: {
    "member-code-rule-form": httpVueLoader("./memberCodeRuleForm.vue"),
  },
};
</script>
<style>
.member-code-edit-rule-member-dialog .el-dialog__body {
  padding-top: 24px;
  padding-bottom: 24px;
}
.member-code-edit-rule-member-dialog .list-wrap {
  max-height: 360px;
  overflow-y: auto;
}
.member-code-edit-rule-member-dialog .list-item {
  font-size: 14px;
  width: 530px;
  line-height: 40px;
  /* margin:8px auto; */
}
.member-code-edit-rule-member-dialog .list-item::after {
  content: " ";
  display: block;
  height: 1px;
  width: 100%;
  background: #f0f0f0;
  transform: scale(1, 0.5);
}
</style>
<style scoped>
@import url("../../../static/memberCode/memberCodeRule.css");
</style>