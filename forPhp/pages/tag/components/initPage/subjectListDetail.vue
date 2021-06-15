<template>
  <div class="page">
    <div class="page-head bg-grey">
      <span class="page-head-txt">主体查看</span>
    </div>
    <div class="page-main page-main-no-scroll bg-grey">
      <div class="search-bar">
        <div class="search-field-item">
          <span class="search-field-item-label">字段名称：</span>
          <el-select
            class="search-field-id"
            style="width: 170px"
            size="mini"
            v-model="fieldId"
            @change="fieldIdChange"
          >
            <el-option
              v-for="item in subjectfields"
              :key="item.field_id"
              :label="item.name"
              :value="item.field_id"
            >
            </el-option>
          </el-select>
          <el-input
            class="search-field-value"
            v-if="fieldShowType === 'INPUT'"
            size="mini"
            v-model="fieldValue"
            @keyup.enter.native="getTableData"
          ></el-input>
          <el-date-picker
            @change="getTableData"
            class="search-field-value"
            v-if="fieldShowType === 'DATETIME'"
            size="mini"
            v-model="fieldValue"
            placeholder="选择日期时间"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div>
          <el-button size="mini" @click="reset">重置</el-button>
          <el-button size="mini" type="primary" @click="getTableData">查询</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <div class="table-head flex-row-between">
          <div class="table-head-txt">数据列表</div>
          <el-button size="mini" v-show="!isQW" @click="patchImport">批量导入</el-button>
        </div>
        <div class="table-main">
          <el-table 
            :data="tableData" 
            style="width: 100%" 
            size="mini" 
            max-height="calc(100% - 5px)" 
            height="calc(100% - 5px)">
            <el-table-column
              v-for="item in tableHeader"
              :key="Object.keys(item)[0]"
              :prop="Object.keys(item)[0]"
              :label="item[Object.keys(item)[0]]"
              min-width="80px"
              show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{scope.row[Object.keys(item)[0]] || '--'}}
            </template>
            </el-table-column>
            <div slot="empty">
              <p>暂无数据</p>
              <el-button size="mini" type="primary">批量导入</el-button>
            </div>
          </el-table>
        </div>
        <div class="table-pagination-wrap flex-row-end">
            <el-pagination
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
    </div>
  </div>
</template>
<script>
module.exports = {
  props: {},
  data() {
    return {
      subjectfields: [],
      fieldId: "",
      fieldValue: "",
      fieldShowType: "INPUT",
      tableHeader: [],
      tableData: [],
      isQW: false,
      pageSize: 10,
      pageNo: 1,
      pageSizes: [10, 15, 20],
      totalNo: 0,
      param: {},
    };
  },
  computed: {},
  created() {
    let id = this.$route.query && this.$route.query.id;
    this.$set(this.param, "id", id);
    this.initPage();
  },

  mounted() {},
  watch: {},
  methods: {
    fieldIdChange(v) {
      let [cur] = this.subjectfields.filter((ele) => ele.field_id === v);
      if (cur && cur.type === "DATETIME") {
        this.fieldShowType = "DATETIME";
        this.fieldValue = ["", ""];
      } else {
        this.fieldShowType = "INPUT";
        this.fieldValue = "";
      }
    },
    initPage() {
      this.subjectfields = [];
      this.fieldId = "";
      this.fieldValue = "";
      this.fieldShowType = "INPUT";
      this.tableHeader = [];
      this.tableData = [];
      this.isQW = false;

      this.pageSize = 10;
      this.pageNo = 1;
      this.totalNo = 0;
      this.getFieldIds();
    },
    // 字段名称选项
    getFieldIds() {
      console.log("查询参数======", this.param);
      this.subjectfields = [
        {
          field_id: "businessID",
          name: "业务id",
          type: "TEXT",
          status: "1", // 1显示 0 隐藏
          is_sys: "1", // 1 不能换顺序
          weigh: 1,
          options: [],
          not_edit: 1,
        },
        {
          field_id: "mobile",
          name: "手机",
          type: "TEXT",
          status: "1",
          is_sys: "1",
          weigh: 2,
          options: [],
          not_edit: 1,
        },
        {
          field_id: "unionID",
          name: "unionID",
          type: "SELECT",
          status: "0",
          is_sys: "1",
          weigh: 3,
          options: ["一二三四五六七八九十一二三四五六七八九十", "b"],
          not_edit: 1,
        },
        {
          field_id: "time",
          name: "时间日期测试一二三四",
          type: "DATETIME",
          status: "0",
          is_sys: "1",
          weigh: 3,
          not_edit: 1,
        },
      ];
      // 默认第一个
      this.fieldId = this.subjectfields[0].field_id;
      if (this.subjectfields[0] && this.subjectfields[0].type === "DATETIME") {
        this.fieldShowType = "DATETIME";
      } else {
        this.fieldShowType = "INPUT";
      }
      // 判断是否是企微
      let sub_plat_type = "THIRD";
      this.isQW = !!(sub_plat_type === "THIRD");
      this.getTableData();
    },
    getTableData() {
      let param = {
        fieldValue: this.fieldValue,
        fieldId: this.fieldId,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        ...this.param,
      };
      console.log("查询参数======", param);
      // this.tableData = []
      // this.totalNo = 111
      this.subjectfields = [
        {
          field_id: "businessID",
          name: "业务id",
          type: "TEXT",
          status: "1", // 1显示 0 隐藏
          is_sys: "1", // 1 不能换顺序
          weigh: 1,
          options: [],
          not_edit: 1,
        },
        {
          field_id: "mobile",
          name: "手机",
          type: "TEXT",
          status: "1",
          is_sys: "1",
          weigh: 2,
          options: [],
          not_edit: 1,
        },
        {
          field_id: "unionID",
          name: "unionID",
          type: "SELECT",
          status: "0",
          is_sys: "1",
          weigh: 3,
          options: ["一二三四五六七八九十一二三四五六七八九十", "b"],
          not_edit: 1,
        },
        {
          field_id: "time",
          name: "时间日期测试一二三四",
          type: "DATETIME",
          status: "0",
          is_sys: "1",
          weigh: 3,
          not_edit: 1,
        },
      ];
      this.tableHeader = [
        {
          yw_id: "业务id",
        },
        {
          name: "姓名",
        },
        {
          t1: "测试1",
        },
        {
          t2: "测试2",
        },
        {
          t3: "测试3",
        },
        {
          t4: "测试4",
        },
        {
          t5: "测试5",
        },
        {
          t6: "测试6",
        },
        {
          t7: "测试7",
        },
        {
          t8: "测试8",
        },
        {
          t9: "测试9",
        },
      ];
      // 空数据测试
      // tableData = [];
      tableData = [
        {
          yw_id: "111",
          name: "xxxxxxxxxxxxxxxxxxxxx",
          t1: "一二三四五六七八九十",
          t2: "一二三四五六七八九十",
          t3: "一二三四五六七八九十",
          t4: "一二三四五六七八九十",
          t5: "一二三四五六七八九十",
          t6: "一二三四五六七八九十",
          t7: "一二三四五六七八九十",
          t8: "一二三四五六七八九十",
          t9: "一二三四五六七八九十",
        },
        {
          yw_id: "222",
          name: "xxx",
        },
        {
          yw_id: "333",
          name: "xxx",
        },
        {
          yw_id: "444",
          name: "xxx",
        },
      ];
      this.tableData = [...tableData, ...tableData, ...tableData, ...tableData];
    },
    patchImport() {},
    reset() {
      this.fieldValue = this.fieldShowType === "DATETIME" ? ["", ""] : "";
      this.getTableData();
    },
    initParam(param) {
      this.$set(this.param, "id", param.id);
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
  beforeRouteUpdate(to, from, next) {
    next();
    this.initParam(to.query);
    this.initPage();
  },
  components: {},
};
</script>
<style scoped>
.page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.page-head {
  display: flex;
  align-items: center;
  height: 58px;
}
.page-head .page-head-txt {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  padding-left: 24px;
  box-sizing: border-box;
}
.page-main {
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
}
.page-main-no-scroll {
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  overflow: hidden;
}
.bg-grey {
  background: rgba(0, 0, 0, 0.04);
}
.page-main .search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: #fff;
}
.page-main .search-bar .search-field-item {
  display: flex;
  align-items: center;
}
.page-main .search-bar .search-field-item .search-field-item-label {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #000000;
  line-height: 22px;
}
.page-main .search-bar .search-field-item .search-field-value {
  width: 320px;
  margin-left: 8px;
}
.page-main .table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 16px;
  background: #fff;
}
.page-main .table-wrap .table-head {
  height: 64px;
  align-items: center;
  padding: 0 24px;
}
.page-main .table-wrap .table-head .table-head-txt {
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: #000000;
  line-height: 24px;
}
.page-main .table-wrap .table-main {
  flex: 1;
  padding: 0 24px;
}
.table-pagination-wrap {
  padding: 5px 24px;
}
</style>