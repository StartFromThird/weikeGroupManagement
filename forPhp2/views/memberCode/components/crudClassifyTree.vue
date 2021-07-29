<template>
  <div class="crud-classify-tree flex-column flex-row-start">
    <div class="crud-classify-tree-head flex-row-between m-b-24">
      <el-input
        class="flex-1 m-r-8"
        placeholder="请输入内容"
        v-model="keyword"
        @keyup.enter.native="searchByKey"
        size="mini"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="mini" @click="handleClickAdd()">新建分组</el-button>
    </div>
    <div class="crud-classify-tree-wrap flex-1">
      <!-- 前端搜索 -->
      <!-- :props="defaultProps"
      :filter-node-method="filterNode" -->
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        default-expand-all
        ref="filterTree"
        draggable
        @node-drop="handleDropTreeNode"
        @node-drag-end="handleDragEnd"
        @node-click="handleNodeClick"
        :indent="8"
      >
        <div
          class="custom-tree-node flex-1 flex-row-between"
          slot-scope="{ node, data }"
        >
          <div class="left-label" @mouseover="(e) => {return mouseenterTree(e, data)}" :label="data.label" :id="node.id">
            <el-tooltip
              v-if="data.isPopover"
              popper-class="crud-classify-tree-label-popover"
              :content="node.label"
              placement="top-start"
            >
              <div class="overflow-ellipsis p-r-8 left-label-txt">
                {{ node.label }}
              </div>
            </el-tooltip>
            <div v-else class="overflow-ellipsis p-r-8 left-label-txt">
              {{ node.label }}
            </div>
            <div class="mock-info-badge" v-if="data.hits_num">
              {{ data.hits_num > 99 ? "99+" : data.hits_num }}
            </div>
          </div>
          <el-popover
            popper-class="crud-classify-tree-operate-popover"
            placement="right-start"
            trigger="hover"
            :visible-arrow="false"
          >
            <div class="right-operate-wrap">
              <div
                class="right-operate-item"
                v-for="item in operateList"
                :key="item.name"
                @click.stop="handleClickOperateItem(item, data)"
              >
                {{ item.name }}
              </div>
            </div>
            <span
              @click.stop="() => {}"
              class="right-operate-btn"
              slot="reference"
            >
              <i class="el-icon-more fs-14"></i>
            </span>
          </el-popover>
        </div>
      </el-tree>
    </div>
    <el-dialog
      :visible.sync="dialog.visible"
      width="418px"
      custom-class="crud-classify-tree-dialog"
    >
      <div slot="title">{{ dialog.title }}</div>
      <el-form
        size="mini"
        label-position="top"
        :model="form"
        ref="crudClassifyForm"
      >
        <el-form-item
          label="分组名称"
          prop="name"
          :rules="[{ required: true, message: '分组名称不可为空' }]"
        >
          <el-input
            placeholder="请输入分组名称"
            v-model="form.name"
            maxlength="10"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
module.exports = {
  name: "crudClassifyTree",
  props: {
    parentSearchParams: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      keyword: "",
      treeData: [],
      operateList: [
        {
          name: "新增子级",
          methods: "addChildren",
        },
        {
          name: "编辑名称",
          methods: "editCurrent",
        },
        {
          name: "删除",
          methods: "delCurrentConfirm",
        },
      ],
      dialog: {
        visible: false,
        title: "",
        type: "add", // add edit
        name: "",
      },
      form: {
        name: "",
        parentId: 0,
      },
    };
  },
  computed: {
    // disabled() {
    //   return this.loading || this.noMore
    // }
  },
  created() {
    this.getTreeData();
  },
  beforeDestroy() {},
  mounted() {},
  watch: {
    keyword(val) {
      d;
      this.getTreeData();
    },
  },
  methods: {
    getQueryVariable,
    mouseenterTree(e, data) {
      let {target} = e;
      if (target.scrollWidth > target.clientWidth) {
        this.$set(data, 'isPopover', true);
      }
    },
    resetTree() {
      this.keyword = "";
      this.getTreeData();
    },
    editCurrent(data) {
      this.dialog.title = "编辑分组名称";
      this.form.name = data.label;
      this.dialog.visible = true;
    },
    addChildren(data) {
      this.dialog.title = "新建分组名称";
      this.form.name = "";
      this.form.parentId = data.id || 0;
      this.dialog.visible = true;
      this.$nextTick(() => {
        if (this.$refs.crudClassifyForm) {
          this.$refs.crudClassifyForm.clearValidate();
        }
      });
    },
    delConfirm(data) {
      console.log("删除====", data, data.id);
      // 删除后回调刷新 tree 数据
      // this.getTreeData();
    },
    delCurrentConfirm(data) {
      if (data.children && data.children.length) {
        this.$confirm(
          "当前分组下有子级分组，删除该组会把子级分组都会删除！",
          "提示",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.delConfirm(data);
          })
          .catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });
          });
      } else {
        this.delConfirm(data);
      }
    },
    handleDropTreeNode(draggingNode, dropNode, dropType, ev) {
      // console.log("dropA====", ...arguments);
      // let id = draggingNode.data && draggingNode.data.id
      // let did = dropNode && dropNode.id
      // console.log("拖拽id===", id, "释放", did);
      var paramData = [];
      // 当拖拽类型不为inner,说明只是同级或者跨级排序，只需要寻找目标节点的父ID，获取其对象以及所有的子节点，并为子节点设置当前对象的ID为父ID即可
      // 当拖拽类型为inner，说明拖拽节点成为了目标节点的子节点，只需要获取目标节点对象即可
      var data = dropType != "inner" ? dropNode.parent.data : dropNode.data;
      var nodeData =
        dropNode.level == 1 && dropType != "inner" ? data : data.children;
      // 设置父ID,当level为1说明在第一级，pid为空
      nodeData.forEach((element) => {
        element.pid = dropNode.level == 1 ? "" : data.id;
      });
      nodeData.forEach((element, i) => {
        var dept = {
          deptId: element.id,
          parentDeptId: element.pid || 0,
          order: i,
        };
        paramData.push(dept);
      });
      console.log("拖拽=====", paramData);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("drag end: ", dropNode && dropNode.label, dropType);
    },
    handleClickAdd(v) {
      this.form = {
        name: "",
        parentId: 0,
      };
      this.$set(this.dialog, "type", "add");
      this.$set(this.dialog, "title", "新建分组名称");
      this.$set(this.dialog, "visible", true);
      this.$nextTick(() => {
        if (this.$refs.crudClassifyForm) {
          this.$refs.crudClassifyForm.clearValidate();
        }
      });
    },
    dialogCancel() {
      this.$set(this.dialog, "visible", false);
    },
    dialogConfirm() {
      console.log("tree save ====", this.form);
      this.$set(this.dialog, "visible", false);
    },
    handleClickOperateItem(item, data) {
      console.log("======", item, data);
      this[item.methods](data);
    },
    // 前端筛选
    // searchByKeyFront(v) {
    // this.$refs.filterTree.filter(this.keyword);
    // },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      this.$emit("updatecurrenttreedata", data);
    },
    getTreeData() {
      console.log("树查询参数===", this.parentSearchParams);
      // mock start
      this.treeData = [
        {
          id: 1,
          pid: 0,
          sort: 0,
          label: "天下为公天下为公天下为公天下为公天下为公",
          children: [
            {
              id: 3,
              pid: 1,
              sort: 0,
              label: "天下为公天下为公天下为公天下为公-11",
              hits_num: 199,
            },
            {
              id: 4,
              pid: 1,
              sort: 0,
              label: "天下为公-4",
              hits_num: 55,
              children: [
                {
                  id: 5,
                  pid: 1,
                  sort: 0,
                  label: "天下为公-5",
                  hits_num: 11,
                },
                {
                  id: 6,
                  pid: 1,
                  sort: 0,
                  label: "天下为公-6",
                  children: [
                    {
                      id: 7,
                      pid: 1,
                      sort: 0,
                      label: "天下为公-7",
                    },
                    {
                      id: 8,
                      pid: 1,
                      sort: 0,
                      label: "天下为公-8",
                      children: [
                        {
                          id: 51,
                          pid: 1,
                          sort: 0,
                          label: "天下为公-51",
                        },
                        {
                          id: 52,
                          pid: 1,
                          sort: 0,
                          label: "天下为公-52",
                          children: [
                            {
                              id: 61,
                              pid: 1,
                              sort: 0,
                              label: "天下为公-61",
                            },
                            {
                              id: 62,
                              pid: 1,
                              sort: 0,
                              label: "天下为公-62",
                              children: [
                                {
                                  id: 71,
                                  pid: 1,
                                  sort: 0,
                                  label: "天下为公-71",
                                },
                                {
                                  id: 72,
                                  pid: 1,
                                  sort: 0,
                                  label: "天下为公-72",
                                  children: [
                                    {
                                      id: 81,
                                      pid: 1,
                                      sort: 0,
                                      label: "天下为公-81",
                                    },
                                    {
                                      id: 82,
                                      pid: 1,
                                      sort: 0,
                                      label: "天下为公-82",
                                      children: [
                                        {
                                          id: 91,
                                          pid: 1,
                                          sort: 0,
                                          label: "天下为公-91",
                                        },
                                        {
                                          id: 92,
                                          pid: 1,
                                          sort: 0,
                                          label: "天下为公-92",
                                          children: [
                                            {
                                              id: 101,
                                              pid: 1,
                                              sort: 0,
                                              label: "天下为公-101",
                                            },
                                            {
                                              id: 102,
                                              pid: 1,
                                              sort: 0,
                                              label: "天下为公-102",
                                              children: [
                                                {
                                                  id: 111,
                                                  pid: 1,
                                                  sort: 0,
                                                  label: "天下为公-111",
                                                },
                                                {
                                                  id: 112,
                                                  pid: 1,
                                                  sort: 0,
                                                  label: "天下为公-112",
                                                  children: [
                                                    {
                                                      id: 121,
                                                      pid: 1,
                                                      sort: 0,
                                                      label: "天下为公-121",
                                                    },
                                                    {
                                                      id: 122,
                                                      pid: 1,
                                                      sort: 0,
                                                      label: "天下为公-122",
                                                      children: [
                                                        {
                                                          id: 131,
                                                          pid: 1,
                                                          sort: 0,
                                                          label: "天下为公-131",
                                                        },
                                                        {
                                                          id: 132,
                                                          pid: 1,
                                                          sort: 0,
                                                          label: "天下为公-132",
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
              ],
            },
          ],
        },
        {
          id: 2,
          pid: 0,
          sort: 0,
          label: "天下为公2",
        },
      ];
      // this.treeData = []
      // mock end
      if (this.treeData && this.treeData.length) {
        let cd = {};
        let back_tree_id = this.getQueryVariable("back_tree_id");
        let back_table_page_no = this.getQueryVariable("back_table_page_no");
        if (back_tree_id) {
          this.$nextTick(() => {
            this.$refs.filterTree.setCurrentKey(back_tree_id);
            cd = this.$refs.filterTree.getCurrentNode();
            if (cd) {
              delete cd.children;
              this.$emit("updatecurrenttreedata", cd, back_table_page_no);
              return ;
            } 
          });
        }
        if (this.treeData[0] && this.treeData[0].id) {
          cd = JSON.parse(JSON.stringify(this.treeData[0]));
          delete cd.children;
          this.$emit("updatecurrenttreedata", cd);
          this.$nextTick(() => {
            this.$refs.filterTree.setCurrentKey(cd.id);
          });
        }
      }
    },
  },
  components: {},
};
</script>

<style scoped>
@import url("../../../static/memberCode/crudClassifyTree.css");
</style>
<style>
.crud-classify-tree-dialog .el-dialog__body {
  padding: 24px;
}
.crud-classify-tree-operate-popover {
  padding: 0;
  width: 84px !important;
  box-sizing: border-box;
  min-width: 84px;
}
.crud-classify-tree-operate-popover .right-operate-item {
  padding: 0 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 400;
  color: #171717;
  cursor: pointer;
}
.crud-classify-tree-operate-popover .right-operate-item:hover {
  background: #1773fa;
  color: #fff;
}
.crud-classify-tree-label-popover .left-label-txt {
  padding-right: 6px;
}
</style>