<template>
<div class="page free-tag-list">
    <div class="page-head bg-grey">
      <span class="page-head-txt">自由标签记录</span>
    </div>
    <div class="page-main">
      <div class="table-wrap">
        <div class="table-head flex-row-between">
          <div class="table-head-txt">数据列表</div>
          <el-button size="mini">批量操作</el-button>
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
              :key="item.key"
              :prop="item.key"
              :label="item.label"
              min-width="80px"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{(item.isTrans ? item.transO[scope.row[item.key]] : scope.row[item.key]) || '--'}}
              </template>
              </el-table-column>
              <el-table-column
                label="标签"
                min-width="380px"
              >
              <template slot-scope="scope">
                <div class="table-row-tag-list-wrap">
                  <div 
                    v-for="(tag, index) in scope.row.tag_list" 
                    :key="index"
                    :class="['table-row-tag-item', `table-row-tag-item-${tag.group_tag_type}`]">
                    <div class="left tag-txt">{{tag.group_name}}</div>
                    <div class="right">
                      <div class="right-txt tag-txt">{{tag.tag_name}}</div>
                      <div class="right-num">{{parseInt(tag.succ_class_num) > 99 ? 99 : tag.succ_class_num }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination-wrap flex-row-end">
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
      </div>
    </div>
</template>
<script>
const tableRowTagClass = {
  HQ: "rgba(23,115,250,0.8)",
  SERVICE: "rgba(255,111,0,0.8)",
};
const tableHeader = [
  {
    label: "操作时间",
    key: "createtime",
  },
  {
    label: "操作者",
    key: "operator",
  },
  // trans
  {
    label: "动作",
    key: "type",
    isTrans: true,
    transO: {
      ADD: "标记",
      DEL: "移除",
    },
  },
  {
    label: "主体",
    key: "subject_name",
  },
  {
    label: "客户数量",
    key: "succ_class_num",
  },
];
module.exports = {
  name: "free-tag-list",
  data() {
    return {
      tableHeader,
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      pageSizes: [10, 15, 20],
      totalNo: 0,
      param: {},
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      let tableData = [
        {
          id: 111,
          createtime: "操作时间",
          operator: "操作者",
          type: "动作：ADD-标记,DEL-移除",
          subject_name: "主体",
          succ_class_num: "客户数量",
          tag_list: [
            {
              group_name: "标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1000",
            },
          ],
        },
        {
          id: 1111,
          createtime: "操作时间",
          operator: "操作者1",
          type: "ADD",
          subject_name: "主体",
          succ_class_num: "客户数量",
          tag_list: [
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "服务标签组名称",
              tag_name: "标签名",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称总部标签组名称",
              tag_name: "标签名总部标签组名称",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name:
                "服务标签组名称总部标签组名称总部标签组名称总部标签组名称",
              tag_name: "标签名总部标签组名称",
              group_tag_type: "SERVICE",
              succ_class_num: "1",
            },
          ],
        },
      ];
      this.tableData = [
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
      ];
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
};
</script>
<style>
.table-row-tag-list-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 100%;
  overflow: auto;
}
.table-row-tag-item {
  border: 1px solid rgba(23, 115, 250, 0.8);
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border-radius: 2px;
  width: fit-content;
  margin-right: 8px;
  margin-bottom: 8px;
  /* overflow: hidden; */
}

.table-row-tag-item .tag-txt {
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  line-height: 20px;
}
.table-row-tag-item .left {
  padding: 0 4px;
  background: #fff;
  white-space: nowrap;
}
.table-row-tag-item .right {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: calc(100% + 2px);
  flex-wrap: nowrap;
  white-space: nowrap;
}
.table-row-tag-item .right .right-num {
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background: #fff;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  margin-left: 4px;
}
/* 总部蓝色，服务端橙色 HQ=总部标签,SERVICE=服务标签*/
.table-row-tag-item-HQ .left,
.table-row-tag-item-HQ .right .right-num {
  color: rgba(23, 115, 250, 0.8);
}
.table-row-tag-item-HQ {
  border-color: rgba(23, 115, 250, 0.8);
}
.table-row-tag-item-HQ .right {
  background: rgba(23, 115, 250, 0.8);
}
.table-row-tag-item-SERVICE .left,
.table-row-tag-item-SERVICE .right .right-num {
  color: rgba(255, 111, 0, 0.8);
}
.table-row-tag-item-SERVICE {
  border-color: rgba(255, 111, 0, 0.8);
}
.table-row-tag-item-SERVICE .right {
  background: rgba(255, 111, 0, 0.8);
}
</style>
<style scoped>
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
