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
          <el-form-item label="成员活码名称：" class="m-b-0">
            <el-input
              size="mini"
              placeholder="请输入名称"
              v-model="search.code_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" class="m-b-0">
            <el-date-picker
              size="mini"
              v-model="search.create_time"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="search-head-right">
        <el-button size="mini">重置</el-button>
        <el-button type="primary" size="mini">查询</el-button>
      </div>
    </div>
    <div class="content-wrap flex-column flex-1 bg-color-fff p-24 m-t-16">
      <div class="content-head flex-row-between p-b-24">
        <div class="content-head-txt">数据列表</div>
        <el-button size="mini">批量操作</el-button>
      </div>
      <div class="content-main flex-row-start flex-1">
        <div class="left p-t-16 p-b-16">
          <crud-classify-tree 
            ref="crudClassifyTree"
            @updatecurrenttreedata="updateCurrentTreeData">
          </crud-classify-tree>
        </div>
        <div class="mid"></div>
        <div class="right flex-1 flex-column">
          <div class="table-head flex-row flex-row-between">
            <div class="table-head-left">
              {{ currentTreeData.label || "-" }}
            </div>
            <div class="table-head-right">
              <el-button
                v-if="currentTreeData && currentTreeData.id"
                type="primary"
                size="mini"
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
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                label="成员活码名称"
                prop="code_name"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="描述"
                prop="description"
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
                      <div class="table-row-tag-list-wrap table-row-tag-list-wrap-limit-height">
                        <!-- ,...scope.row.tag_list,...scope.row.tag_list, ...scope.row.tag_list -->
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
              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <el-button type="text" size="mini">查看详情</el-button>
                  <el-button type="text" size="mini">编辑</el-button>
                  <el-button type="text" size="mini" v-if="scope.row.is_del"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- v-else-if="tableData && (!tableData.length)" -->
            <div
              
              class="empty-tree-data"
            >
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
    updateCurrentTreeData(d) {
      this.currentTreeData = d.id ? d : {};
      this.pageNo = 1;
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
      // 查询参数
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        classify: this.currentTreeData.id,
      };
      console.log("param====", param);
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
          is_del: 0,
          tag_list: [
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
      this.tableData = tableData;
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
