Vue.component("role-management", {
  template: `<div class="roleManagementWrap">
  <div class="head">
    <div></div>
    <div>角色管理</div>
    <el-button type="text" size="mini" class="addBtn" @click="appendClassify">
      <i class="el-icon-circle-plus-outline"></i>
    </el-button>
  </div>
  <div class="classifyMain">
    <div
      class="classifyItem"
      v-for="classify in classifyRole"
      :key="classify.id"
    >
      <div class="classifyhead">
        <div class="classifyName">
          <template
            v-if="classify.classifyName && classify.classifyName.length > 14"
          >
            <el-tooltip
              effect="dark"
              :content="classify.classifyName"
              placement="top"
            >
              <span>{{ classify.classifyName.slice(0, 14) + '...' }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span>{{ classify.classifyName || '-' }}</span>
          </template>
        </div>
        <div class="handleWrap">
          <el-button
            type="text"
            size="mini"
            class="addBtn"
            @click="editClassify(classify)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="text"
            size="mini"
            class="addBtn"
            @click="removeClassify(classify)"
          >
            <i class="el-icon-remove-outline"></i>
          </el-button>
          <el-button
            type="text"
            size="mini"
            class="addBtn"
            @click="appendRole(classify)"
          >
            <i class="el-icon-circle-plus-outline"></i>
          </el-button>
        </div>
      </div>
      <div class="roleItem" v-for="role in classify.roles" :key="role.id">
        <div class="roleName" @click="handleClickRole(role)">
          <template v-if="role.roleName && role.roleName.length > 14">
            <el-tooltip
              effect="dark"
              :content="role.roleName"
              placement="top"
            >
              <span>{{ role.roleName.slice(0, 14) + '...' }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span>{{ role.roleName || '-' }}</span>
          </template>
        </div>
        <div class="handleWrap">
          <el-button
            type="text"
            size="mini"
            class="addBtn"
            @click="editRole(role, classify)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="text"
            size="mini"
            class="addBtn"
            @click="removeRole(role)"
          >
            <i class="el-icon-remove-outline"></i>
          </el-button>
          <div></div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :before-close="handleCloseDialog"
  >
    <span v-if="isDialogTxt">{{ dialogTxt }}</span>
    <el-input
      v-if="isDialogInput"
      :placeholder="dialogInputPlaceholder"
      v-model="dialogInputValue"
      clearable
      :maxlength="dialogInputMaxLength"
      show-word-limit
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelDialog">取 消</el-button> -->
      <el-button type="primary" @click="confirmDialog">确 定</el-button>
    </span>
  </el-dialog>
</div>`,
  props: {
    defaultClassifyRole: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      dialogTitle: "",
      dialogVisible: false,
      dialogWidth: "50%",
      dialogInputPlaceholder: "",
      dialogInputValue: "",
      isDialogTxt: false,
      isDialogInput: false,
      dialogTxt: "",
      dialogInputMaxLength: "30",
    };
  },
  computed: {
    classifyRole: function () {
      return [...this.defaultClassifyRole];
    },
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClickRole(role) {
      this.$emit("handleClickRole", role);
    },
    appendClassify() {
      this.dialogTitle = "新增分类";
      this.isDialogInput = true;
      this.isDialogTxt = false;
      this.dialogInputPlaceholder = "新增分类名称";
      this.dialogInputValue = "";
      this.dialogVisible = true;
      // this.$emit('appendClassify')
    },
    editClassify(classify) {
      this.dialogTitle = "编辑分类";
      this.isDialogInput = true;
      this.isDialogTxt = false;
      this.dialogInputPlaceholder = "编辑分类名称";
      this.dialogInputValue = classify.classifyName;
      this.dialogVisible = true;
    },
    removeClassify(classify) {
      this.isDialogInput = false;
      this.dialogTxt = true;
      this.dialogTitle = "提示";
      this.dialogTxt = "是否删除角色分类？";
      this.isDialogTxt = true;
      this.isDialogInput = false;
      this.dialogVisible = true;
    },
    appendRole(classify) {
      console.log(classify);
      location.href = `./updateRole.html?type=add&classifyId=${classify.id}&classifyName=${classify.classifyName}`;
    },
    editRole(role, classify) {
      // this.dialogTitle = "编辑角色";
      // this.isDialogInput = true;
      // this.dialogInputPlaceholder = "编辑角色名称";
      // this.dialogInputValue = role.name;
      // this.dialogVisible = true;
      location.href = `./updateRole.html?type=edit&classifyId=${classify.id}&classifyName=${classify.classifyName}&roleId=${role.id}`;
    },
    removeRole(role) {
      this.dialogTxt = true;
      this.dialogTitle = "提示";
      this.dialogTxt = "是否删除角色？";
      this.isDialogTxt = true;
      this.dialogVisible = true;
    },
    handleCloseDialog() {
      this.dialogVisible = false;
      this.isDialogTxt = false;
      this.isDialogInput = false;
      this.dialogInputValue = "";
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.isDialogTxt = false;
      this.isDialogInput = false;
      this.dialogInputValue = "";
    },
    async confirmDialog() {
      this.dialogVisible = false;
      // await 调后台保存信息 回调外层刷新数据
      this.$emit("updataClassifyRole");
    },
  },
});
