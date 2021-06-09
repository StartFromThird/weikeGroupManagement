Vue.component("add-tag-dialog", {
  template: `
  <div>
    <slot>
      <el-button
        class="add-role-btn"
        plain
        size="mini"
        @click="dialogVisible = true"
      >
        添加人群包
      </el-button>
    </slot>
    <el-dialog
      :visible.sync="dialogVisible"
      modal-append-to-body
      lock-scroll
      :destroy-on-close="false"
      :title="title"
      custom-class="add-tag-dialog"
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
          ></el-input>
          <el-button size="mini" type="primary" @click="searchByKey">
            搜索
          </el-button>
        </div>
        <div class="selectWrap">
          <div class="left">
            <div
              class="infinite-list-wrap"
              v-infinite-scroll="onLoad"
              :infinite-scroll-disabled="disabled"
              :infinite-scroll-distance="50"
            >
              <el-checkbox-group v-model="curSelectedIds">
                <div
                  v-for="item in listData"
                  class="infinite-list-item"
                  :key="item.id"
                >
                  <el-checkbox
                    @change="
                      (e) => {
                        selectedChange(e, item)
                      }
                    "
                    :label="item['id']"
                  >
                    {{ item[labelKey] }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
              <p class="list-tip" v-if="loading">加载中...</p>
              <p class="list-tip" v-if="noMore">没有更多了</p>
            </div>
          </div>
          <div class="right">
            <el-tag
              size="small"
              closable
              v-for="(tag, i) in selected"
              :key="tag.id"
              @close="handleDelRight(i, tag)"
              class="tag-item"
            >
              <div class="tag-item-content">
                <el-tooltip
                  effect="dark"
                  :content="tag[labelKey]"
                  placement="top"
                >
                  <div class="tag-item-content-left">
                    <span class="tag-item-left-txt">
                      {{ tag[labelKey] }}
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
      labelKey: "name",
      curSelectedIds: [],
      param: {},
      // 左侧滚动加载列表
      listData: [],
      // 为了保证搜索时自动触发，必须撑满
      pageSize: 20,
      pageNum: 1,
      totalNum: 0,
      loading: false,
      noMore: false,
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
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
          this.curSelectedIds = [...this.selectedIds];
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectedChange(v, data) {
      let idI = this.selectedIds.indexOf(data.id);
      if (v) {
        if (idI === -1) {
          this.handleSelect(data);
        }
      } else {
        this.handleDel(idI);
      }
    },
    // 左侧选中
    handleSelect(data) {
      this.selected.push(data);
      this.selectedIds.push(data.id);
    },
    // 左侧 已选中 删除
    handleDel(i) {
      this.selected.splice(i, 1);
      this.selectedIds.splice(i, 1);
    },
    // 右侧 tag 删除
    handleDelRight(i, data) {
      let idI = this.curSelectedIds.indexOf(data.id);
      if (idI !== -1) {
        this.handleDel(i);
        this.curSelectedIds.splice(idI, 1);
      }
    },
    onLoad() {
      this.getData();
    },
    getData() {
      let param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        ...this.param,
      };
      console.log("查询参数====", param);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        // mock start
        let res = {
          count: 41,
          list: [
            {
              id: "5fffeb25fabb1a000c419a64",
              name: "tidb实时的画像场景包实时的画像场景包实时的画像a1",
            },
            {
              id: "60827cda44c0e0000d9902d8",
              name: "人群包c001",
            },
            {
              id: "5fffeb25fabb1a000c419a642",
              name: "tidb实时的画像场景包a2",
            },
            {
              id: "60827cda44c0e0000d9902d82",
              name: "人群包c002",
            },
            {
              id: "5fffeb25fabb1a000c419a643",
              name: "tidb实时的画像场景包a3",
            },
            {
              id: "60827cda44c0e0000d9902d83",
              name: "人群包c003",
            },
            {
              id: "5fffeb25fabb1a000c419a6423",
              name: "tidb实时的画像场景包a3",
            },
            {
              id: "60827cda44c0e0000d9902d823",
              name: "人群包c003",
            },
            {
              id: "5fffeb25fabb1a000c419a6424",
              name: "tidb实时的画像场景包a4",
            },
            {
              id: "60827cda44c0e0000d9902d824",
              name: "人群包c004",
            },
          ],
        };
        let listData = [...res.list, ...res.list];
        if (this.pageNum === 3) {
          listData = [listData[0]];
        }
        listData = listData.map((ele, index) => {
          return {
            id: ele.id + `${this.pageNum}-${index}`,
            name: `${this.pageNum}-${index}` + ele.name,
          };
        });
        // mock end
        this.totalNum = res.count;
        this.listData = [...this.listData, ...listData];
        // mock end
        if (this.listData.length >= this.totalNum) {
          this.noMore = true;
        } else {
          this.noMore = false;
          this.pageNum++;
        }
      }, 300);
    },
    searchByKey() {
      this.$set(this.param, "keyword", this.keyword);
      this.pageNum = 1;
      this.totalNum = 0;
      this.listData = [];
      this.noMore = false;
      this.loading = false;
      this.getData();
    },
    clearSearch() {
      delete this.param["keyword"];
      this.pageNum = 1;
      this.totalNum = 0;
      this.listData = [];
      this.noMore = false;
      this.getData();
    },
    // 已选中 删除
    handleDelMember(i) {
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
  },
  components: {},
});
