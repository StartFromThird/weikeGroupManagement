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
      <el-button size="mini" @click="test()">11</el-button>
    </div>
    <div class="crud-classify-tree-wrap flex-1">
      <!-- :props="defaultProps" -->
      <el-tree
        class="filter-tree"
        :data="treeData"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        ref="filterTree"
      >
        <div
          class="custom-tree-node flex-1 flex-row-between"
          slot-scope="{ node, data }"
        >
          <div class="left-label">{{ node.label }}</div>
          <el-popover placement="right" width="84" trigger="hover">
            <div class="right-operate-wrap">
              <!-- {{operateList}} -->
              <div
                v-for="item in operateList"
                :key="item.name"
                @click="handleClickOperateItem(item)"
              >
                {{ item.name }}
              </div>
            </div>
            <span class="right-operate-btn" slot="reference">
              <i class="el-icon-more"></i>
            </span>
            <!-- <el-button slot="reference">click 激活</el-button> -->
          </el-popover>
        </div>
      </el-tree>
    </div>
    <el-dialog 
      :visible.sync="dialog.visible" 
      width="418px"
      custom-class="crud-classify-tree-dialog">
      <div slot="title">{{ dialog.title }}</div>
      <el-form 
        size="mini" 
        label-position="top"
        :model="form">
        <el-form-item 
          label="分组名称"
          prop="name"
          :rules="[
            { required: true, message: '分组名称不可为空'}
          ]">
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
        <el-button size="mini" type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
module.exports = {
  name: "crudClassifyTree",
  props: {
    subject: {
      type: String,
      default: "",
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
          methods: "delCurrent",
        }
      ],
      dialog: {
        visible: false,
        title: "",
        type: "add", // add edit
        name: "",
      },
      form: {
        name: ''
      }
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
      this.searchByKey();
    },
  },
  methods: {
    test() {
      let id = this.$refs.filterTree.getCurrentKey()
      console.log("id===", id);
    },
    handleClickAdd(v) {
      this.$set(this.dialog, "type", "add");
      this.$set(this.dialog, "title", "新建分组名称");
      this.$set(this.dialog, "visible", true);
    },
    dialogCancel() {
      this.$set(this.dialog, "visible", false);
    },
    dialogConfirm() {
      this.$set(this.dialog, "visible", false);
    },
    handleClickOperateItem(item) {
      console.log("======", item);
    },
    searchByKey() {
      this.$refs.filterTree.filter(this.keyword);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getTreeData() {
      this.treeData = [
        {
          id: 1,
          pid: 0,
          sort: 0,
          label: "天下为公",
          children: [
            {
              id: 3,
              pid: 1,
              sort: 0,
              label: "天下为公-11",
            },
            {
              id: 4,
              pid: 1,
              sort: 0,
              label: "天下为公-4",
              children: [
                {
                  id: 5,
                  pid: 1,
                  sort: 0,
                  label: "天下为公-5",
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
      if (this.treeData && this.treeData.length) {
        if (this.treeData[0] && this.treeData[0].id) {
          let cd = JSON.parse(JSON.stringify(this.treeData[0]))
          delete cd.children
          this.$emit('updatecurrenttreedata', cd)
          this.$nextTick(() => {
            this.$refs.filterTree.setCurrentKey(cd.id)
          })
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
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>