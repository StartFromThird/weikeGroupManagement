<template>
  <div class="page member-code-list flex-column">
    <div class="search-head-wrap flex-row-between bg-color-fff p-24">
      <div class="search-head-left flex-1">
        <el-form
          :inline="true"
          :model="search"
          size="mini"
          class="demo-form-inline"
        >
          <el-form-item label="成员活码名称：" class="m-b-0 m-r-24">
            <el-input
              style="width: 210px"
              size="mini"
              placeholder="请输入名称"
              v-model="search.code_name"
              maxlength="10"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" class="m-b-0">
            <el-date-picker
              style="width: 320px"
              size="mini"
              v-model="search.create_time"
              type="datetimerange"
              placeholder="选择日期时间"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-head-right">
        <el-button size="mini" @click="resetHeadSearch">重置</el-button>
        <el-button type="primary" size="mini" @click="headSearch"
          >查询</el-button
        >
      </div>
    </div>
    <div class="content-wrap flex-column flex-1 bg-color-fff p-24 m-t-16">
      <div class="content-head flex-row-between">
        <div class="content-head-txt">数据列表</div>
      </div>
      <div class="content-main flex-row-start flex-1">
        <div class="left p-t-16 p-b-16">
          <crud-classify-tree
            ref="crudClassifyTree"
            :parent-search-params="search"
            @updatecurrenttreedata="updateCurrentTreeData"
          >
          </crud-classify-tree>
        </div>
        <div class="mid"></div>
        <div class="right flex-1 flex-column">
          <div class="table-head flex-row flex-row-between">
            <div class="table-head-left overflow-ellipsis">
              {{ currentTreeData.label || "" }}
            </div>
            <div class="table-head-right">
              <el-button
                v-if="currentTreeData && currentTreeData.id"
                type="primary"
                size="mini"
                @click="handleListItemAdd"
              >
                新增成员活码
              </el-button>
            </div>
          </div>
          <div class="table-body flex-1">
            <el-table
              v-if="currentTreeData && currentTreeData.id"
              :data="tableData"
              style="width: 100%"
              size="mini"
              max-height="calc(100% - 5px)"
              height="calc(100% - 5px)"
            >
              <el-table-column label="二维码" width="100px">
                <template slot-scope="scope">
                  <el-image
                    style="width: 42px; height: 42px"
                    :src="scope.row.url"
                    fit="fill"
                    @click="previewCodeImg(scope.row)"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline fs-24"></i>
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                label="成员活码名称"
                prop="code_name"
                show-overflow-tooltip
                min-width="120px"
              >
              </el-table-column>
              <el-table-column
                label="描述"
                prop="description"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="分组名称"
                prop="group_name"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="创建时间"
                prop="create_time"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="引流数量（人）"
                prop="people_num"
                show-overflow-tooltip
                min-width="120px"
              >
              </el-table-column>
              <el-table-column label="关联标签" width="620px">
                <template slot-scope="scope">
                  <div class="table-row-tag-cell flex-row-between">
                    <div
                      :class="[
                        scope.row.isTagOver > 40
                          ? 'table-row-tag-list-wrap table-row-tag-list-wrap-1-row'
                          : 'table-row-tag-list-wrap',
                      ]"
                    >
                      <div
                        v-for="(tag, index) in scope.row.tag_list"
                        :key="index"
                        :class="[
                          'table-row-tag-item',
                          `table-row-tag-item-${tag.group_tag_type}`,
                        ]"
                      >
                        <div class="left tag-txt">{{ tag.group_name }}</div>
                        <div class="right">
                          <div class="right-txt tag-txt">
                            {{ tag.tag_name }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <el-popover
                      v-if="scope.row.isTagOver > 40"
                      placement="bottom-end"
                      trigger="hover"
                      width="542"
                    >
                      <div
                        class="
                          table-row-tag-list-wrap
                          table-row-tag-list-wrap-limit-height
                        "
                      >
                        <div
                          v-for="(tag, index) in [...scope.row.tag_list]"
                          :key="index"
                          :class="[
                            'table-row-tag-item',
                            `table-row-tag-item-${tag.group_tag_type}`,
                          ]"
                        >
                          <div class="left tag-txt">{{ tag.group_name }}</div>
                          <div class="right">
                            <div class="right-txt tag-txt">
                              {{ tag.tag_name }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="table-row-tag-more" slot="reference">
                        <i
                          class="el-icon-more"
                          v-if="scope.row.isTagOver > 40"
                        ></i>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150px" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleListItemDetail(scope.row, scope.index)"
                    >查看详情</el-button
                  >
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
            <!-- v-else-if="tableData && (!tableData.length)" -->
            <div class="empty-tree-data" v-else-if="tableData && (!tableData.length)">
              <div class="empty-tree-data-txt">暂无分组！</div>
              <el-button size="mini" type="primary" @click="addNewClassify"
                >新建分组</el-button
              >
            </div>
            <!-- 二维码弹窗 -->
            <el-dialog
              :visible.sync="previewDialog.dialogVisible"
              width="418px"
            >
              <div slot="title">{{ previewDialog.title }}</div>
              <div style="text-align: center; margin-bottom: 40px">
                <el-image
                  :src="previewDialog.imgUrl"
                  style="width: 285px; height: 285px"
                >
                </el-image>
              </div>
              <a :href="previewDialog.imgUrl" :download="previewDialog.imgName">
                <el-button size="small" type="primary" class="w-100percent">
                  下载二维码
                </el-button>
              </a>
            </el-dialog>
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
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "member-code-list",
  data() {
    return {
      previewDialog: {
        dialogVisible: false,
        title: "二维码",
        imgUrl: "",
        imgName: "",
      },
      search: {},
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      pageSizes: [10, 15, 20],
      totalNo: 0,
      param: {},
      currentTreeData: {},
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    handleListItemAdd() {
      let id = (this.currentTreeData && this.currentTreeData.id) || 0;
      let name =
        (this.currentTreeData && this.currentTreeData.label.substring(0, 10)) ||
        "";
      location.href = `./memberCodeEdit.html?type=add${
        id ? `&group_id=${id}` : ""
      }${name ? `&group_name=${name}` : ""}`;
    },
    handleListItemEdit(row, index) {
      let id = (this.currentTreeData && this.currentTreeData.id) || 0;
      location.href = `./memberCodeEdit.html?type=edit&id=${row.id}&group_id=${id}&page_no=${this.pageNo}`;
    },
    handleListItemDetail(row, index) {
      let id = (this.currentTreeData && this.currentTreeData.id) || 0;
      location.href = `./memberCodeDetail.html?id=${row.id}&group_id=${id}&page_no=${this.pageNo}`;
    },
    handleListItemDel(row, index) {
      this.$confirm("确认删除该条成员活码?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateCurrentTreeData(d, pageNo) {
      this.currentTreeData = d.id ? JSON.parse(JSON.stringify(d)) : {};
      this.pageNo = parseInt(pageNo) || 1;
      this.getTableData();
    },
    addNewClassify() {
      this.$refs.crudClassifyTree.handleClickAdd();
    },
    previewCodeImg(row) {
      this.previewDialog.dialogVisible = true;
      this.previewDialog.imgUrl = row.url;
      this.previewDialog.imgName = row.code_name;
    },
    downloadCodeImg() {
      let a = document.createElement("a");
      // a.download = name + ".xls";
      a.href = this.previewDialog.imgUrl;
      $("body").append(a); // 修复firefox中无法触发click
      a.click();
      $(a).remove();
    },
    getTableData() {
      if (!this.currentTreeData.id) {
        this.tableData = [];
        return;
      }
      // 查询参数
      let param = {
        ...this.search,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        classify: this.currentTreeData.id,
      };
      console.log("table参数====", param);
      // mock start
      let tableData = [
        {
          id: 1,
          version: 1,
          create_time: "2021-06-28 10:18:35",
          update_time: "2021-06-28 10:18:35",
          delete_time: null,
          code_name: "天下为公活码名称",
          url: "https://www.baidu.com/img/flexible/logo/pc/result.png",
          code_ditch_id: 1,
          description: "66666",
          is_tag: "2",
          display_cw_ditch: "天下为公",
          is_open: 2,
          people_num: 0,
          begin_time: "",
          tab_name: "",
          is_del: 1,
          tag_list: [
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            }
          ],
        },
        {
          id: 1111,
          createtime: "操作时间",
          operator: "操作者1",
          type: "ADD",
          subject_name: "主体",
          succ_class_num: "客户数量",
          code_name: "天下为公活码名称11111111111",
          is_del: 0,
          tag_list: [
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "总部标签组名称",
              tag_name: "标签名",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三",
              tag_name: "一十六",
              group_tag_type: "SERVICE",
              succ_class_num: "2",
            },
            {
              group_name: "一二三四五六",
              tag_name: "一二三四五六七",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九十",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九",
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
            {
              group_name: "一二三四五六",
              tag_name: "一二三四五六七",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九十",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九",
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
            {
              group_name: "一二三四五六",
              tag_name: "一二三四五六七",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九十",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九",
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
            {
              group_name: "一二三四五六",
              tag_name: "一二三四五六七",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九十",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九",
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
            {
              group_name: "一二三四五六",
              tag_name: "一二三四五六七",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九十",
              group_tag_type: "HQ",
              succ_class_num: "1",
            },
            {
              group_name: "一二三四五六七八九十",
              tag_name: "一二三四五六七八九",
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
      tableData = [
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
        ...tableData,
      ];

      tableData.map((row) => {
        let tagsTxtLen = 0;
        if (row.tag_list && row.tag_list.length) {
          row.tag_list.map((tag) => {
            let tagItemTxtLen = tag.group_name.length + tag.tag_name.length;
            if (tagItemTxtLen) {
              tagsTxtLen = tagsTxtLen + tagItemTxtLen + 2;
            }
          });
        }
        row.isTagOver = tagsTxtLen - 1;
      });
      // tableData = []
      // mock end
      this.tableData = tableData;
      this.totalNo = 150;
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
    resetHeadSearch() {
      this.search = {};
      this.$refs.crudClassifyTree.resetTree();
    },
    headSearch() {
      console.log("index 参数==", this.search);
      this.$refs.crudClassifyTree.getTreeData();
      // this.pageNo = 1;
      // this.getTableData();
    },
  },
  components: {
    "crud-classify-tree": httpVueLoader("./components/crudClassifyTree.vue"),
  },
};
</script>
<style>
@import url("../../static/tag/tagItemList.css");
</style>
<style scoped>
@import url("../../static/memberCode/memberCodeList.css");
</style>
