<template>
  <div class="page subject-edit">
    <div class="page-head">
      <span class="page-head-txt">编辑配置主体</span>
      <el-popover placement="right" trigger="hover">
        <div>
          {{
            isQW && pageType === "add"
              ? "只可编辑配置主体相关名称需保存，保存后不可编辑修改！"
              : "首次新建并按照步骤配置主体配置需保存，保存后不可编辑修改，仅可新增字段！"
          }}
        </div>
        <img
          class="tip"
          slot="reference"
          src="../../static/image/common/info.png"
        />
      </el-popover>
    </div>
    <div class="page-main" id="subject-edit-page-main">
      <div class="page-main-step">
        <div class="page-main-step-index">1</div>
        <div class="page-main-step-txt">
          基础{{ pageType === "add" ? "设置" : "信息" }}
        </div>
        <!-- {{ pageType }}---{{ id }}---{{ isQW }} -->
      </div>
      <!-- 新增填表 -->
      <template v-if="pageType === 'add'">
        <el-form
          label-position="top"
          label-width="80px"
          :model="info"
          :rules="baseRules"
          ref="infoForm"
          size="mini"
        >
          <el-row>
            <el-col :sm="24" :md="12" :lg="12">
              <el-form-item
                label="平台渠道："
                prop="sub_plat_type"
                v-if="type === 'HUMAN'"
              >
                <el-select
                  v-model="info.sub_plat_type"
                  placeholder="请选择"
                  @change="subPlatTypeChange"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in platformOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主体名称：" prop="sub_name">
                <el-input
                  v-model="info.sub_name"
                  placeholder="请输入主体名称"
                  maxlength="20"
                  clearable
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="主体标识：" prop="sub_en_name">
                <el-input
                  v-model="info.sub_en_name"
                  placeholder="请输入主体标识"
                  maxlength="20"
                  clearable
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-model="info.remark"
                  placeholder="请输入备注"
                  maxlength="100"
                  clearable
                  show-word-limit
                ></el-input>
              </el-form-item>
              <template v-if="isQW">
                <el-form-item label="AppID：" prop="appid">
                  <el-input
                    v-model="info.appid"
                    placeholder="请输入AppID"
                    maxlength="100"
                    clearable
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="AppSecret：" prop="app_secret">
                  <el-input
                    v-model="info.app_secret"
                    placeholder="请输入AppSecret"
                    maxlength="100"
                    clearable
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <div class="flex-row-end">
                  <el-button size="mini" @click="confirmGoBack">取消</el-button>
                  <el-button size="mini" type="primary" @click="save"
                    >提交</el-button
                  >
                </div>
              </template>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- 编辑 表信息显示 -->
      <template v-else-if="pageType === 'edit'">
        <div class="edit-info">
          <div class="edit-info-head">
            <img
              v-if="isQW"
              class="img"
              src="../../static/image/common/qywx@2x.png"
              alt="企微"
            />
            <div class="txt">
              {{
                `${info.sub_type === "HUMAN" ? info.headTxt + "@" : ""}${
                  info.sub_name
                }`
              }}
            </div>
          </div>
          <div class="edit-info-row">
            <div class="edit-info-txt" v-if="type === 'HUMAN'">
              平台渠道：{{ info.sub_plat_type_name }}
            </div>
            <div class="edit-info-txt">主体标识：{{ info.sub_en_name }}</div>
          </div>
          <div class="edit-info-row" v-if="info.sub_plat_type === 'THIRD'">
            <div class="edit-info-txt">AppID：{{ info.appid }}</div>
            <div class="edit-info-txt">AppSecret：{{ info.app_secret }}</div>
          </div>
          <div class="edit-info-txt">备注：{{ info.remark }}</div>
        </div>
      </template>
      <template v-if="!(isQW && pageType === 'add')">
        <div class="page-main-step" v-if="!isQW">
          <div class="page-main-step-index">2</div>
          <div class="page-main-step-txt">新增编辑字段</div>
        </div>
        <div class="edit-key-wrap">
          <div class="edit-table-wrap">
            <el-table
              :data="tableData"
              style="width: 100%"
              size="mini"
              header-cell-class-name="tag-sub-edit-table-head"
            >
              <el-table-column label="字段ID" width="180">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.field_id"
                    placeholder="请输入"
                    size="mini"
                    maxlength="20"
                    :disabled="scope.row.not_edit === 1"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="字段名称" width="180">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    placeholder="请输入"
                    size="mini"
                    maxlength="10"
                    :disabled="scope.row.not_edit === 1"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="字段类型" width="100">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.type"
                    placeholder="请选择"
                    size="mini"
                    :disabled="scope.row.not_edit === 1"
                  >
                    <el-option
                      v-for="item in keyTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="值" min-width="280">
                <template slot-scope="scope">
                  <template v-if="scope.row.type === 'SELECT'">
                    <!-- <el-select v-if="scope.row.not_edit !== 1" -->
                    <el-select
                      v-if="scope.row.not_edit !== 1"
                      style="width: 100%"
                      size="mini"
                      v-model="scope.row.options"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请输入"
                      :disabled="scope.row.not_edit === 1"
                      :class="[scope.row.not_edit === 1 ? 'not_edit' : '']"
                    >
                    </el-select>
                    <div class="value-tag-wrap"
                      v-if="scope.row.not_edit === 1">
                      <el-tag
                        v-for="tag in scope.row.options"
                        size="mini"
                        type="info"
                        :key="tag"
                        effect="plain"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </template>
                  <el-input
                    v-else
                    disabled
                    :placeholder="keyTypePlaceholder[scope.row.type] || '-'"
                    size="mini"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <div class="operate-box flex-row-between">
                    <div
                      class="operate-box-item"
                      v-if="info.sub_plat_type == 'BUSINESS'"
                    >
                      <el-button
                        class="fw400"
                        v-if="scope.row.status === '1'"
                        size="mini"
                        type="text"
                        @click="
                          handleChangeVisiable(scope.$index, scope.row, '0')
                        "
                      >
                        隐藏
                      </el-button>
                      <el-button
                        class="fw400"
                        v-else
                        size="mini"
                        type="text"
                        @click="
                          handleChangeVisiable(scope.$index, scope.row, '1')
                        "
                      >
                        显示
                      </el-button>
                    </div>
                    <div class="operate-box-item">
                      <el-button
                        class="fw400"
                        size="mini"
                        type="text"
                        @click="handleChangeIndex(scope.$index, scope.row, -1)"
                        v-if="
                          scope.row.is_sys !== '1' &&
                          scope.$index > 0 &&
                          tableData[scope.$index - 1].not_edit !== 1
                        "
                      >
                        上移
                      </el-button>
                    </div>
                    <div class="operate-box-item">
                      <el-button
                        class="fw400"
                        v-if="
                          scope.row.is_sys !== '1' &&
                          scope.$index < tableData.length - 1
                        "
                        size="mini"
                        type="text"
                        @click="handleChangeIndex(scope.$index, scope.row, 1)"
                      >
                        下移
                      </el-button>
                    </div>
                    <div class="operate-box-item">
                      <el-button
                        class="fw400"
                        v-if="scope.row.not_edit !== 1"
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button
                      >
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              size="mini"
              style="width: 100%; margin-top: 10px; border: 1px dashed #eee"
              @click="addKeyItem"
              id="tagAddKeyBtn"
              v-if="!isQW"
              >+ 新增字段</el-button
            >
            <div class="flex-row-end mt-20" v-if="!isQW">
              <el-button size="mini" @click="confirmGoBack">取消</el-button>
              <el-button size="mini" type="primary" @click="save"
                >提交</el-button
              >
            </div>
          </div>
          <div
            class="mobile-show"
            v-if="isWidthEnough && info.sub_plat_type === 'BUSINESS'"
          >
            <div class="title">客户画像实时预览</div>
            <div class="preview-content">
              <img src="../../static/image/tag/phone.png" alt="" class="bg" />
              <div class="preview-info">
                <div class="preview-header">
                  <img
                    src="../../static/image/tag/phone-header.png"
                    class="phone-header"
                  />
                  <div class="user-info">
                    <img
                      :src="portraitInfo.avatr"
                      alt=""
                      class="preview-avatr"
                    />
                    <div class="user-detail">
                      <span class="nickname">{{ portraitInfo.nickname }}</span>
                      <!-- 微信or企业微信 -->
                      <template>
                        <span
                          :class="[
                            portraitInfo.type == 1
                              ? 'baseWechatColor1'
                              : 'baseqyWechatColor1',
                            'font12',
                            'mg-lf4',
                            'company-name',
                          ]"
                        >
                          {{ typeList[portraitInfo.type] }}
                        </span>
                      </template>
                      <!-- 性别 -->
                      <template>
                        <img
                          src="../../static/image/common/man.png"
                          class="sex-icon"
                          alt=""
                          v-if="portraitInfo.sex == 1"
                        />
                        <img
                          src="../../static/image/common/women.png"
                          class="sex-icon"
                          alt=""
                          v-if="portraitInfo.sex == 2"
                        />
                      </template>
                    </div>
                  </div>
                </div>
                <div class="preview-list">
                  <!-- 自定义信息 -->
                  <template v-for="(item, index) of tableData">
                    <div
                      class="preview-item"
                      :key="index"
                      v-if="item.name && item.status === '1'"
                    >
                      <div class="preview-item-left">
                        <span>{{ item.name }}</span>
                        <span>:</span>
                      </div>
                      <div
                        class="preview-item-right overflow-ellipsis"
                        v-if="item.type === 'SELECT'"
                      >
                        {{ (item.options && item.options[0]) || "-" }}
                      </div>
                      <div class="preview-item-right overflow-ellipsis" v-else>
                        {{ keyTypePlaceholder[item.type] || "-" }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {},
  data() {
    return {
      pageType: "add",
      type: "",
      id: "",
      platformOption: [],
      baseInfo: {
        sub_plat_type: "",
        sub_name: "",
        sub_en_name: "",
        remark: "",
        appid: "",
        app_secret: "",
      },
      info: {},
      rules: {},
      baseRules: {
        sub_plat_type: [
          {
            required: true,
            message: "平台渠道不可为空，请选择",
            trigger: "blur",
          },
        ],
        sub_name: [
          {
            required: true,
            message: "主体名称不可为空，请输入",
            trigger: "blur",
          },
          {
            min: 0,
            max: 20,
            message: "长度不超过 20 个字",
            trigger: "blur",
          },
        ],
        sub_en_name: [
          {
            required: true,
            message: "主体标识不可为空，请输入",
            trigger: "blur",
          },
          {
            min: 0,
            max: 20,
            message: "长度不超过 20 个字",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "备注不可为空，请输入",
            trigger: "blur",
          },
          {
            min: 0,
            max: 100,
            message: "长度不超过 100 个字",
            trigger: "blur",
          },
        ],
        appid: [
          {
            required: true,
            message: "AppID不可为空，请输入",
            trigger: "blur",
          },
          {
            min: 0,
            max: 100,
            message: "长度不超过 100 个字",
            trigger: "blur",
          },
        ],
        app_secret: [
          {
            required: true,
            message: "AppSecret不可为空，请输入",
            trigger: "blur",
          },
          {
            min: 0,
            max: 100,
            message: "长度不超过 100 个字",
            trigger: "blur",
          },
        ],
      },
      isQW: false,
      // 自定义字段
      tableData: [],
      keyTypePlaceholder: {
        TEXT: "文本",
        NUMBER: "数值",
        DATETIME: "YYYY-MM-DD HH:MM:SS",
        BOOLEAN: "是/否",
      },
      // 预览
      portraitInfo: {
        nickname: "小丁",
        sex: 1, //1男 2女
        type: "1", //1为微信,2为企业微信;
        avatr:
          "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      },
      baseInfoLists: [],
      customInfoList: [],
      typeList: {
        1: "@微信",
        2: "@企业微信",
      },
      isWidthEnough: false,
      timer: null,
    };
  },
  created() {
    this.initParam(this.$route.query);
    this.initPage();
    window.addEventListener("resize", this.getWidth);
  },
  mounted() {},
  watch: {},
  beforeRouteUpdate(to, from, next) {
    next();
    this.initParam(to.query);
    this.initPage();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWidth);
  },
  methods: {
    getWidth() {
      if (this.info && this.info.sub_plat_type !== "BUSINESS") {
        return;
      }
      if (this.timer) {
        return;
      }
      this.timer = setTimeout(() => {
        let d = document.querySelector("#subject-edit-page-main").clientWidth;
        console.log(d);
        // this.isWidthEnough = !!(d > 1088);
        this.isWidthEnough = !!(d > 1220);
        this.timer = null;
      }, 300);
    },
    checkTableValue() {
      let len = this.tableData.length;
      let checkRes = true;
      let idArr = [];
      let nameArr = [];
      for (let i = 0; i < len; i++) {
        let ele = this.tableData[i];
        if (
          ele.field_id &&
          ele.name &&
          ((ele.type === "SELECT" && ele.options && ele.options.length) ||
            ele.type !== "SELECT")
        ) {
          let isSameId = idArr.includes(ele.field_id);
          let isSameName = nameArr.includes(ele.name);
          if (isSameId || isSameName) {
            this.$message({
              message: `字段${
                isSameId ? "ID" : isSameName ? "名称" : ""
              }重复，请重新输入`,
              type: "warning",
            });
            checkRes = false;
            break;
          } else {
            idArr.push(ele.field_id);
            nameArr.push(ele.name);
          }
          continue;
        } else {
          checkRes = false;
          this.$message({
            message: "字段存在空值，请重新输入",
            type: "warning",
          });
          break;
        }
      }
      return checkRes;
    },
    save() {
      if (this.pageType === "edit") {
        if (this.isQW) {
          // 调后台接口
          console.log("调后台接口====", this.info);
          // this.info.id = "2";
          // setTimeout(() => {
          //   this.afterConfirm();
          // }, 3000);
        } else {
          let checkTableRes = this.checkTableValue();
          if (checkTableRes) {
            // 调后台接口
            console.log("调后台接口====", this.tableData);
          }
        }
      } else if (this.pageType === "add") {
        this.$refs["infoForm"].validate((valid) => {
          if (valid) {
            if (this.isQW) {
              // 调后台接口
              console.log("调后台接口====", this.info);
            } else {
              let checkTableRes = this.checkTableValue();
              if (checkTableRes) {
                // 调后台接口
                console.log("调后台接口====", this.tableData);
              }
            }
          }
          return;
        });
      }
    },
    // 保存主体数据后
    afterConfirm() {
      let href = `.#/subjectListDetail?id=${this.info.id}&type=${
        this.$route.query && this.$route.query.type
      }`;
      location.href = href;
    },
    // table方法
    addKeyItem() {
      let newItem = {
        field_id: "",
        name: "",
        type: "", // "BOOLEAN" "SELECT"
        status: "1", // 1显示 0 隐藏
        is_sys: "0", // 1 不能换顺序
        options: [],
        isNew: true,
        optionTxt: "",
      };
      if (this.keyTypeOptions && this.keyTypeOptions.length) {
        newItem.type = this.keyTypeOptions[0].value;
      }
      this.tableData.push(newItem);
      this.$nextTick(() => {
        document.getElementById("tagAddKeyBtn").scrollIntoView();
      });
    },
    handleChangeVisiable(i, r, v) {
      r.status = v;
    },
    handleChangeIndex(i, r, gap) {
      let [a, b] = [this.tableData[i], this.tableData[i + gap]];
      this.tableData[i] = b;
      this.tableData[i + gap] = a;
      this.tableData = JSON.parse(JSON.stringify(this.tableData));
    },
    handleDelete(i, r) {
      this.tableData.splice(i, 1);
    },
    getBaseData() {
      let param = {
        sub_id: this.id,
        type: this.type,
      };
      console.log("查table 历史数据====", param);
      let data = {
        subject_info: {
          sub_id: 7, //新增主体没有sub_id
          // sub_type: "GOOD",
          // sub_plat_type: "BUSINESS",
          sub_plat_type_name: "业务系统111",
          sub_type: "HUMAN",
          sub_plat_type: "THIRD",
          sub_plat_type_name: "企微系统",
          sub_name: "百果园22",
          sub_en_name: "baiguoyuan",
          remark: "xxx",
          appid: "appid-xxx",
          app_secret: "secret-111",
        },
        subjectfields: [
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
            options: [
              "一二三四五六七八九一二三四五六七八九一二三四五六七八九",
              "b",
              "a",
              "一二三",
            ],
            not_edit: 1,
          },
        ],
        keyTypeOptions: [],
      };
      this.tableData = data.subjectfields;
      if (this.pageType === "edit") {
        // @前
        let info = data.subject_info;
        const transO = {
          GOOD: "货",
          SCENE: "场",
        };
        info.headTxt =
          info.sub_type === "HUMAN"
            ? info.sub_plat_type_name
            : transO[info.sub_type] || "";
        this.info = Object.assign({}, info);
        this.isQW = !!(info.sub_plat_type === "THIRD");
        this.getWidth();
      }
    },
    getKeyTypeOptions() {
      console.log("查新增字段类型===");
      this.keyTypeOptions = [
        {
          label: "文本",
          value: "TEXT",
        },
        {
          label: "单选框",
          value: "RADIO",
        },
        {
          label: "复选框",
          value: "CHECKBOX",
        },
        {
          label: "选择器",
          value: "SELECT",
        },
        {
          label: "文件",
          value: "FILE",
        },
        {
          label: "日期",
          value: "DATE",
        },
        {
          label: "时间",
          value: "DATETIME",
        },
        {
          label: "数字",
          value: "NUMBER",
        },
        {
          label: "布尔",
          value: "BOOLEAN",
        },
      ];
    },
    // 切换平台类型
    subPlatTypeChange(v) {
      this.info.sub_plat_type = this.info.sub_plat_type_last;
      this.$confirm("切换平台渠道，当前编辑内容将失去！", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.info.sub_plat_type = v;
          this.info.sub_plat_type_last = v;
          this.info.sub_name = "";
          this.info.sub_en_name = "";
          this.info.remark = "";
          this.info.appid = "";
          this.info.app_secret = "";
          let curO = this.platformOption.filter((ele) => {
            return ele.value === v;
          });

          if (curO[0] && curO[0].is_qw) {
            this.isQW = true;
            this.tableData = [];
            return;
          } else {
            this.isQW = false;
            this.getWidth();
          }
          this.$refs["infoForm"].clearValidate();
        })
        .catch(() => {
          console.log("取消切换=====");
        });
    },
    getPlatformOption() {
      this.platformOption = [
        {
          label: "企微系统",
          value: "THIRD",
          is_qw: 1,
        },
        {
          label: "业务系统",
          value: "BUSINESS",
          is_qw: 0,
        },
      ];
      if (this.pageType === "add") {
        this.$set(this.info, "sub_plat_type", this.platformOption[0].value);
        this.$set(
          this.info,
          "sub_plat_type_last",
          this.platformOption[0].value
        );
        this.isQW = !!this.platformOption[0].is_qw;
      }
    },
    initPage() {
      this.getWidth();
      if (this.type === "HUMAN") {
        this.getPlatformOption();
      }
      this.getKeyTypeOptions();
      this.getBaseData();
      // this.init;
    },
    initParam(param) {
      this.pageType = (param && param.pageType) || "add";
      this.type = (param && param.type) || "";
      this.id = (param && param.id) || "";
      // 数据重置
      this.isQW = false;
      this.info = { ...this.baseInfo };
      this.isWidthEnough = false;
      this.timer = null;
      this.tableData = [];
    },
    confirmGoBack(path) {
      this.$confirm("当前页面未保存，确定离开当前页面吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.history.go(-1);
        })
        .catch(() => {});
    },
  },
  components: {},
  name: "subjectEdit",
};
</script>
<style scoped>
.edit-table-wrap .el-select .el-select__tags {
  overflow-x: auto;
}
.value-tag-wrap {
  overflow-x: auto;
  border: 1px solid #e4e7ed;
  background: #f5f7fa;
  border-radius: 2px;
}
.value-tag-wrap .el-tag {
  margin: 2px 0 2px 6px;
}
</style>
<style scoped>
.page.subject-edit {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.subject-edit {
  /* 客户画像 */
}

.subject-edit .page-head {
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  height: 58px;
}

.subject-edit .page-head .page-head-txt {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
  padding-left: 24px;
  box-sizing: border-box;
}

.subject-edit .tip {
  width: 18px;
  height: 18px;
  margin-left: 8px;
}

.subject-edit .page-main {
  flex: 1;
  box-sizing: border-box;
  padding: 8px 24px;
  overflow-y: auto;
}

.subject-edit .page-main .page-main-step {
  padding: 16px 0;
  display: flex;
  align-items: center;
}

.subject-edit .page-main .page-main-step .page-main-step-index {
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background: #1773fa;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-right: 8px;
}

.subject-edit .page-main .edit-key-wrap {
  display: flex;
}

.subject-edit .operate-box {
  width: 100%;
}

.subject-edit .operate-box .operate-box-item {
  width: 25%;
}

.subject-edit .mt-20 {
  margin-top: 20px;
}

.subject-edit .edit-info .edit-info-head {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.subject-edit .edit-info .edit-info-head .img {
  width: 26px;
  height: 26px;
  margin-right: 12px;
}

.subject-edit .edit-info .edit-info-head .txt {
  font-size: 22px;
  font-weight: 500;
  text-align: left;
  color: #171717;
  line-height: 30px;
  letter-spacing: 1px;
}

.subject-edit .edit-info .edit-info-row {
  display: flex;
  margin-bottom: 8px;
}

.subject-edit .edit-info .edit-info-row .edit-info-txt {
  min-width: 400px;
}

.subject-edit .edit-info .edit-info-txt {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}

.subject-edit .mobile-show {
  margin-left: 20px;
}

.subject-edit .mobile-show .title {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: #171717;
  line-height: 22px;
}

.subject-edit .preview-content {
  margin: 14px auto 0;
  width: 280px;
  height: 557px;
  position: relative;
}

.subject-edit .preview-content .bg {
  width: 100%;
  height: 100%;
}

.subject-edit .preview-content .preview-info {
  position: absolute;
  top: 17px;
  left: 18px;
  bottom: 17px;
  right: 20px;
  border-radius: 25px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.subject-edit .preview-info .preview-header .phone-header {
  width: 100%;
}

.subject-edit .preview-header .user-info {
  position: absolute;
  top: 65px;
  left: 10px;
  display: flex;
  align-items: center;
}

.subject-edit .preview-header .user-info .user-detail {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.subject-edit .preview-header .user-info .user-detail .baseWechatColor1 {
  color: #00c000;
}

.subject-edit .preview-header .user-info .user-detail .baseqyWechatColor1 {
  color: #ff6f00;
}

.subject-edit .preview-header .user-info .preview-avatr {
  width: 40px;
  height: 40px;
  margin-right: 8px;
  border-radius: 5px;
}

.subject-edit .preview-header .user-info .nickname {
  font-size: 12px;
  font-weight: bold;
  color: #171717;
  margin-right: 4px;
}

.subject-edit .preview-header .user-info .sex-icon {
  width: 10px;
  height: 10px;
  margin-left: 4px;
}

.subject-edit .preview-header .user-info .company-name {
  font-size: 10px;
}

.subject-edit .preview-list {
  /* flex: 1; */
  padding: 0 10px;
  box-sizing: border-box;
  height: calc(100% - 160px);
  overflow-y: auto;
}

.subject-edit .preview-list .preview-item {
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-bottom: 1px solid #f5f7fa;
}

.subject-edit .preview-list .preview-item .preview-item-left {
  font-size: 10px;
  color: #171717;
  line-height: 14px;
  width: 106px;
}

.subject-edit .preview-list .preview-item .preview-item-right {
  font-size: 10px;
  font-weight: bold;
  color: #171717;
  line-height: 14px;
  max-width: 50%;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
