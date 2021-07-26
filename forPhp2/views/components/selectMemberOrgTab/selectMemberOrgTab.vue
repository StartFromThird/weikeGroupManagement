<template>
  <div class="selectMemberOrgTab">
    <div class="filter">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="请输入用户名称搜索"
        @clear="clearSearchMemberKey"
        @keyup.enter.native="searchMemberByKey"
        v-model.trim="keyword"
        clearable
        size="mini"
      ></el-input>
      <el-button size="mini" type="primary" @click="searchMemberByKey">
        搜索
      </el-button>
    </div>
    <div class="selectMemberWrap">
      <div class="left">
        <div class="memberTree">
          <template v-if="memberTreeType === 'default'">
            <el-tree
              ref="tree"
              :data="treeData"
              :default-expanded-keys="expandedKeys"
              node-key="id"
              :props="defaultProps"
              @node-click="handleNodeClick"
              @node-expand="handleNodeExpand"
              :highlight-current="true"
              :show-checkbox="isMultipleCheckBox"
              check-strictly
              @check="handleCheck"
              render-after-expand
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <template v-if="node.label && node.label.length > 12">
                  <el-tooltip
                    effect="dark"
                    :content="node.label"
                    placement="top"
                  >
                    <span @click.stop="customSelect(node, data)">{{
                      node.label.slice(0, 12) + "..."
                    }}</span>
                  </el-tooltip>
                </template>
                <template v-else>
                  <span @click.stop="customSelect(node, data)">{{
                    node.label
                  }}</span>
                </template>
                <img
                  class="selected-tick"
                  v-if="selectedMemberIds.includes(data.id)"
                  src="../../../static/image/selectMemberOrgTab/tick@2x.png"
                  alt="已选"
                />
              </span>
            </el-tree>
          </template>
          <div class="member-box" v-if="memberTreeType === 'search'">
            <div
              class="member-item"
              v-for="item in searchMemberResultList"
              :key="item.id"
              :label="item.department_name"
              :value="item.id"
              @click.stop="selectSearchMember(item)"
            >
              <div class="tag-item-left">
                <img
                  :src="
                    item.isOrg
                      ? '../../../static/image/selectMemberOrgTab/department@2x.png'
                      : '../../../static/image/selectMemberOrgTab/member@2x.png'
                  "
                />
                <el-tooltip
                  effect="dark"
                  :content="
                    item.isOrg ? item.department_name : item.member_name
                  "
                  placement="top"
                >
                  <span class="tag-item-left-txt">{{
                    item.isOrg ? item.department_name : item.member_name
                  }}</span>
                </el-tooltip>
              </div>
              <!-- v-if="tag.isOrg" 现在要求都显示上级 -->
              <div
                style="
                  max-width: 30%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                <el-tooltip
                  effect="dark"
                  :content="item.parent_name"
                  placement="top"
                >
                  <span class="tag-item-parent-name">{{
                    item.parent_name
                  }}</span>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="selectedMember">
          <el-tag
            size="small"
            closable
            v-for="(tag, i) in selectedMembers"
            :key="tag.id"
            @close="handleDelMember(i)"
            class="tag-item"
            type="info"
          >
            <div class="tag-item-content">
              <div class="tag-item-left">
                <img
                  :src="
                    tag.isOrg
                      ? '../../../static/image/selectMemberOrgTab/department@2x.png'
                      : '../../../static/image/selectMemberOrgTab/member@2x.png'
                  "
                />
                <el-tooltip
                  effect="dark"
                  :content="tag.isOrg ? tag.department_name : tag.member_name"
                  placement="top"
                >
                  <span class="tag-item-left-txt">{{
                    tag.isOrg ? tag.department_name : tag.member_name
                  }}</span>
                </el-tooltip>
              </div>
              <!-- v-if="tag.isOrg" 现在要求都显示上级 -->
              <div class="tag-item-parent-name">
                <el-tooltip
                  effect="dark"
                  :content="tag.parent_name"
                  placement="top"
                >
                  <span>{{ tag.parent_name }}</span>
                </el-tooltip>
              </div>
            </div>
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "select-member-org-tab",
  props: {
    isMultipleSelected: {
      type: Boolean,
      default: true,
    },
    isMultipleCheckBox: {
      type: Boolean,
      default: false,
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object,
      default: function () {
        return {
          type: "",
        };
      },
    },
    selectedMemberOrg: {
      type: Array,
      default: function () {
        return [];
      },
    },
    customSelectedFn: {
      type: Function,
      default: function () {
        return true;
      },
    },
  },
  data() {
    return {
      selectedMembers: [],
      selectedMemberIds: [],
      memberTreeType: "default",
      memberList: [],
      keyword: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "department_name",
        isLeaf: "isLeaf",
      },
      searchMemberResultList: [],
      expandedKeys: [],
    };
  },
  computed: {},
  async created() {
    this.treeData = await this.getOrgList(0);
  },
  mounted() {},
  watch: {
    selectedMemberOrg: {
      handler(n, o) {
        this.selectedMembers = JSON.parse(JSON.stringify(n));
        this.selectedMemberIds = this.selectedMembers.map((ele) => ele.id);
        this.$forceUpdate();
      },
      immediate: true,
    },
  },
  methods: {
    handleCheck(node, checked) {
      this.handleCheckMember(checked);
    },
    // 多选check操作，更新选中营运点成员
    handleCheckMember(checked) {
      this.selectedMembers = checked.checkedNodes;
    },
    // 单选选中节点
    handleSelectMember(data) {
      let d = this.customSelectedFn(data);
      if (!this.customSelectedFn(data)) {
        return;
      }
      if (!this.selectedMemberIds.includes(data.id)) {
        if (this.isMultipleSelected) {
          this.selectedMembers.push(data);
          this.selectedMemberIds.push(data.id);
        } else {
          this.selectedMembers = [];
          this.selectedMemberIds = [];
          this.$nextTick(() => {
            this.selectedMembers = [data];
            this.selectedMemberIds = [data.id];
          });
        }
      }
    },
    // 已选中营运点成员 删除
    handleDelMember(i) {
      this.selectedMembers.splice(i, 1);
      this.selectedMemberIds.splice(i, 1);
    },
    async customSelect(node, data) {
      let idI = this.selectedMemberIds.indexOf(data.id);
      if (idI == -1) {
        this.handleSelectMember(data);
        this.$refs.tree.setCurrentKey(data.id);
      } else {
        this.handleDelMember(idI);
      }
    },
    async handleNodeExpand(data, node, com) {
      if (!data.isLeaf) {
        // 判断部门节点 子节点 是否已请求过
        if (node.childNodes && node.childNodes.length) {
          return;
        }
        let key = node.key;
        let child = [];
        // 判断部门节点 子节点 是部门还是成员 data.isNextOrg
        if (key < 3) {
          child = await this.getOrgList(key);
        } else {
          child = await this.getMember(key);
        }
        if (child && child.length) {
          this.$refs.tree.updateKeyChildren(key, child);
        }
      }
    },
    // 左侧树节点点击
    async handleNodeClick(data, node) {
      // 点击成员节点 保存右侧
      if (!data.isOrg) {
        if (!this.isMultipleCheckBox) {
          this.handleSelectMember(data);
        }
        return;
      }
      // 判断部门节点 子节点 是否已请求过
      if (node.childNodes && node.childNodes.length) {
        return;
      }

      let key = node.key;
      let child = [];
      // 判断部门节点 子节点 是部门还是成员 data.isNextOrg
      if (key < 3) {
        child = await this.getOrgList(key);
      } else {
        child = await this.getMember(key);
      }
      if (child && child.length) {
        console.log("请求children===", child);
        this.$refs.tree.updateKeyChildren(key, child);
        this.expandedKeys = [data.id];
      }
    },
    clearSearchMemberKey() {
      this.keyword = "";
      // 数据还原
      this.memberTreeType = "default";
    },
    // 关键字搜索成员
    async searchMemberByKey() {
      if (this.keyword) {
        this.memberTreeType = "search";
        let list = await this.getMember();
        this.searchMemberResultList = [...list];
      } else {
        this.memberTreeType = "default";
        this.treeData = await this.getOrgList(0);
      }
    },
    async selectSearchMember(item) {
      this.keyword = item.department_name;
      this.memberTreeType = "default";
      // 通过成员反向查树节点
      // await this.getParentTree(item.id)
      this.treeData = [
        {
          department_name: `反向查树1`,
          id: 201,
          isOrg: true,
          isLeaf: false,
          children: [
            {
              department_name: `反向查树1-1`,
              id: 202,
              isOrg: true,
              children: [
                {
                  ...item,
                },
              ],
            },
            {
              department_name: `反向查树1-2`,
              id: 203,
              isOrg: true,
              isLeaf: false,
            },
          ],
        },
      ];
      this.expandedKeys = [item.id];
      this.handleSelectMember(item);
    },
    // 获取成员
    async getMember(id, label = [], parentNode) {
      console.log("param===", this.param);
      let params = {};
      params.id = id || "";
      params.keyword = this.keyword || "";
      if (this.keyword) {
        return [
          {
            member_name: `关键词查询__1`,
            department_name: `关键词查询__1`,
            id: 101,
            isOrg: false,
            isLeaf: true,
            parent_name: "人也要显示父级",
          },
          {
            member_name: `关键词查询__2`,
            department_name: `关键词查询__2`,
            id: 102,
            isOrg: false,
            isLeaf: true,
            parent_name: "父级",
          },
          {
            member_name: `关键词查询很长很长很长很长很长很长很长很长很长很长__3`,
            department_name: `关键词查询很长很长很长很长很长很长很长很长很长很长__3`,
            id: 103,
            isOrg: true,
            isLeaf: false,
            parent_name: "父节点很长很长很长很长很长很长很长很长很长",
          },
          {
            member_name: `关键词部门没成员很长很长很长很长很长很长很长__3`,
            department_name: `关键词部门没成员很长很长很长很长很长很长很长很长很长__3`,
            id: 104,
            isOrg: true,
            isLeaf: true,
            parent_name: "父节点",
          },
        ];
      }
      // 造成员数据
      let node = [];
      const pre = `成员节点__`;
      for (let i = id; i < id + 2; i++) {
        let o = {
          member_name: `${pre}${id}__${id + i}`,
          id: id + i,
          isOrg: false,
          isLeaf: true,
          parent_name: "父节点",
        };
        o.department_name = o.member_name;
        node.push(o);
      }
      return node;
    },
    // 获取部门
    async getOrgList(id, groupInfo = {}) {
      console.log("param===", this.param);
      // 此处应该是按部门id 逐级去查询
      // let res = await http.getGroupList({
      //   'department_id': _id,
      //   'levelGap': 1,
      //   'param': this.param
      // })
      // if (res && res.data) {
      //   this.treeData = res.data
      // }
      return new Promise((res, rej) => {
        setTimeout(() => {
          let node = [];
          const pre = `部门节点__`;
          if (id === 0) {
            node[0] = {
              parent_name: `父节点_${id}`,
              department_name: `${pre}${id + 1}`,
              id: id + 1,
              isOrg: true,
              // 是否是叶子节点 注意与部门字段区别
              isLeaf: false,
            };
          } else {
            // 造子部门数据
            for (let i = id; i < id + 4; i++) {
              let o = {
                parent_name: `父节点_${id}`,
                department_name: `${pre}${id}__${id + i}`,
                id: id + i,
                isOrg: true,
                isLeaf: false,
              };
              node.push(o);
            }
          }
          res(node);
        }, 500);
      });
    },
  },
};
</script>
<style scoped>
@import url("./selectMemberOrgTab.css");
</style>
