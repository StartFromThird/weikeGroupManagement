Vue.component("add-role-dialog", {
  template: `
  <div  class="add-role-dialog-com">
  <slot>
    <el-button
      class="add-role-btn"
      plain
      size="mini"
      @click="dialogVisible = true"
    >
      添加角色
    </el-button>
  </slot>
  <el-dialog
    :visible.sync="dialogVisible"
    modal-append-to-body
    lock-scroll
    :destroy-on-close="false"
    :title="title"
    custom-class="add-role-dialog"
  >
    <div class="select-main-wrap">
      <div class="filter-header">
        <el-input
          prefix-icon="el-icon-search"
          placeholder="请输入角色名称搜索"
          @clear="clearSearch"
          @keyup.enter.native="searchByKey"
          v-model.trim="keyword"
          clearable
          size="mini"
          show-word-limit
        ></el-input>
  
        <el-button size="mini" type="primary" @click="searchByKey">
          搜索
        </el-button>
      </div>
      <div class="selectWrap">
        <div class="left">
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
            :filter-node-method="filterNode"
            check-strictly
            render-after-expand
            default-expand-all
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <template v-if="node.label && node.label.length > 12">
                <el-tooltip
                  effect="dark"
                  :content="node.label"
                  placement="top"
                >
                  <span>
                    {{ node.label.slice(0, 12) + '...' }}
                  </span>
                </el-tooltip>
              </template>
              <template v-else>
                <span>
                  {{ node.label }}
                </span>
              </template>
              <img
                class="selected-tick"
                v-if="selectedIds.includes(data.id)"
                src="../../static/image/components/tick@2x.png"
                alt="已选"
              />
            </span>
          </el-tree>
        </div>
        <div class="right">
          <el-tag
            size="small"
            closable
            v-for="(tag, i) in selected"
            :key="tag.id"
            @close="handleDel(i)"
            class="tag-item"
            type="info"
          >
            <div class="tag-item-content">
              <el-tooltip
                effect="dark"
                :content="tag['role']"
                placement="top"
              >
                <div class="tag-item-content-left">
                  <span class="tag-item-left-txt">
                    {{ tag['role'] }}
                  </span>
                </div>
              </el-tooltip>
            </div>
          </el-tag>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelChoose">取 消</el-button>
      <el-button type="primary" @click="confirmChoose">确 定</el-button>
    </span>
  </el-dialog>
  </div>`,
  props: {
    title: {
      type: String,
      default: "",
    },
    writeBackChoose: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      selected: [],
      selectedIds: [],
      keyword: "",
      defaultProps: {
        children: "roles",
        label: "role",
      },
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  mounted() {},
  watch: {
    writeBackChoose: {
      handler(n, o) {
        if (n) {
          this.selected = JSON.parse(JSON.stringify(n));
          this.selectedIds = this.selected.map((ele) => ele.id);
        }
      },
      immediate: true,
    },
  },
  methods: {
    searchByKey() {
      this.$refs.tree.filter(this.keyword);
    },
    clearSearch() {
      this.$refs.tree.filter(this.keyword);
    },
    filterNode(value, data, node) {
      if (!value) return true;
      return node.label.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      if (data.category_id) {
        return;
      }
      let idI = this.selectedIds.indexOf(data.id);
      if (idI == -1) {
        this.handleSelect(data);
        this.$refs.tree.setCurrentKey(data.id);
      } else {
        this.handleDel(idI);
      }
    },
    handleSelect(data) {
      if (!this.selectedIds.includes(data.id)) {
        this.selected.push(data);
        this.selectedIds.push(data.id);
      }
    },
    // 已选中 删除
    handleDel(i) {
      this.selected.splice(i, 1);
      this.selectedIds.splice(i, 1);
    },
    cancelChoose() {
      this.dialogVisible = false;
      // this.selected = JSON.parse(
      //   JSON.stringify(this.writeBackSelectedMemberOrg)
      // )
    },
    confirmChoose() {
      this.$emit("confirmChoose", JSON.parse(JSON.stringify(this.selected)));
    },
    getData() {
      let treeData = [
        {
          category_id: 14,
          category_name: "123",
          roles: [
            {
              id: 15,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11123",
              data_permission: "",
              category: 14,
            },
            {
              id: 16,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "161123",
              data_permission: "",
              category: 14,
            },
          ],
        },
        {
          category_id: 114,
          category_name: "123",
          roles: [
            {
              id: 115,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11123",
              data_permission: "",
              category: 14,
            },
            {
              id: 116,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1161161161123",
              data_permission: "",
              category: 14,
            },
            {
              id: 117,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11723",
              data_permission: "",
              category: 14,
            },
            {
              id: 118,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1181161161123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1115,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1116,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1161161161123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1117,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11723",
              data_permission: "",
              category: 14,
            },
            {
              id: 1118,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1181161161123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1215,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1216,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1161161161123",
              data_permission: "",
              category: 14,
            },
            {
              id: 1217,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "11723",
              data_permission: "",
              category: 14,
            },
            {
              id: 1218,
              version: 3,
              create_time: "2021-05-22 17:52:35",
              update_time: "2021-05-22 18:03:50",
              delete_time: null,
              role: "1181161161123",
              data_permission: "",
              category: 14,
            },
          ],
        },
      ];
      this.treeData = treeData.map((ele) => {
        return {
          ...ele,
          role: ele.category_name,
          id: ele.category_id,
        };
      });
    },
  },
  components: {},
});
