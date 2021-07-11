Vue.component("role-authority", {
  template: `<div>
  <el-tree
    class="searchTreeWrap"
    ref="authorityTree"
    :data="authorityTree || []"
    default-expand-all
    show-checkbox
    node-key="id"
    :props="defaultProps"
    :highlight-current="true"
    :expand-on-click-node="false"
  >
    <div slot-scope="{ data }" :class="data.isFloat ? 'isFloat' : ''">
      <div
        v-if="data.isFloat"
      >
        {{ data.name }}
      </div>
      <div v-else>{{ data.name }}</div>
    </div>
  </el-tree>
</div>`,
  props: {
    defaultSetAuthority: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      authorityTree: [],
    };
  },
  methods: {
    changeStyle() {
      var leafNode = document.getElementsByClassName("isFloat");
      for (var i = 0; i < leafNode.length; i++) {
        leafNode[i].parentNode.style.cssFloat = "left";
        // leafNode[i].parentNode.parentNode.parentNode.style.display = "flex";
        // leafNode[i].parentNode.parentNode.parentNode.style.flexWrap = "wrap";
      }
    },
    getTreeData() {
      this.authorityTree = [
        {
          name: `Tree0`,
          id: "0",
          children: [
            {
              name: `Tree1`,
              id: "1",
              children: [
                {
                  name: `Tree3`,
                  id: "3",
                  isAuthorityNode1: true,
                  // isAuthorityNode: true,
                  isLeafAuthorityALL: false,
                  isIndeterminate: true,
                  // leafAuthority: [
                  children: [
                    {
                      name: "新增",
                      id: "4",
                      isFloat: true,
                      value: "add",
                    },
                    {
                      name: "编辑",
                      id: "5",
                      isFloat: true,
                      value: "edit",
                    },
                    {
                      name: "删除",
                      id: "6",
                      isFloat: true,
                      value: "del",
                    },
                    {
                      name: "新增1",
                      id: "14",
                      isFloat: true,
                      value: "add",
                    },
                    {
                      name: "编辑1",
                      id: "15",
                      isFloat: true,
                      value: "edit",
                    },
                    {
                      name: "删除1删除1删除1删除1删除1删除1",
                      id: "16",
                      isFloat: true,
                      value: "del",
                    },
                    {
                      name: "删除2",
                      id: "17",
                      isFloat: true,
                      value: "del",
                    },
                  ],
                },
              ],
            },
            {
              name: `Tree2`,
              id: "2",
            },
            {
              name: `Tree10`,
              id: "10",
            },
          ],
        },
      ];
      this.$nextTick(() => {
        this.changeStyle();
      });
    },
  },
  computed: {
    setAuthority: function () {
      return [...this.defaultSetAuthority];
    },
  },
  created() {
    this.getTreeData();
  },
  mounted() {
    // this.changeStyle()
  },
  watch: {
    setAuthority: {
      handler(n, o) {
        this.$nextTick(() => {
          this.$refs.authorityTree.setCheckedKeys([...n]);
        });
      },
      immediate: true,
    },
  },
});
