Vue.component("synchronization-dialog", {
  template: `
<div>
  <el-badge :value="200" :max="99">
    <el-button
      class="synchronization-btn"
      size="mini"
      plain
      @click="dialogVisible = true"
    >
      <i class="el-icon-message-solid"></i>
      同步内容
    </el-button>
  </el-badge>
  <el-dialog
    :visible.sync="dialogVisible"
    width="400px"
    modal-append-to-body
    append-to-body
    lock-scroll
    title="同步内容"
    :destroy-on-close="true"
    @open="dialogOpen"
    @closed="dialogClosed"
    custom-class="synchronization-dialog"
  >
    <div class="synchronization-dialog-main-wrap">
      <div class="btn-groups">
        <el-button size="mini" @click="batchStatusChange(1)">全部忽略</el-button>
        <el-button size="mini" @click="batchStatusChange(2)" type="primary">
          全部同步
        </el-button>
      </div>
      <el-tabs v-model="activeTab" @tab-click="handleClickTabs">
        <el-tab-pane label="全部" name="1"></el-tab-pane>
        <el-tab-pane label="待处理" name="2"></el-tab-pane>
      </el-tabs>
      <div
        class="synchronization-list-wrap"
        v-infinite-scroll="onLoad"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-distance="50"
      >
        <div class="list-item" v-for="item in listData" :key="item.id">
          <div class="list-item-head">
            {{ item.headTxt }}
          </div>
          <div class="list-item-main">
            <div class="list-item-main-left">
              <div>{{ item.changeTxt }}</div>
              <div>{{ item.time }}</div>
            </div>
            <div class="list-item-main-right">
              <span v-if="item.status === '1'">已同步</span>
              <span v-else-if="item.status === '2'">已忽略</span>
              <div v-else>
                <el-button size="mini">忽略</el-button>
                <el-button size="mini" type="primary">同步</el-button>
              </div>
            </div>
          </div>
        </div>
        <p class="list-tip" v-if="loading">加载中...</p>
        <p class="list-tip" v-if="noMore">没有更多了</p>
      </div>
    </div>
  </el-dialog>
</div>`,
  props: {
    synchronizationType: {
      type: String,
      default: "默认类型取值",
    },
  },
  data() {
    return {
      dialogVisible: false,
      activeTab: "1",
      listData: [],
      pageSize: 10,
      pageNum: 1,
      loading: false,
      noMore: false,
    };
  },
  methods: {
    onLoad() {
      this.getListData();
    },
    dialogClosed() {
      this.activeTab = "1";
    },
    dialogOpen() {
      this.pageNum = 1;
      this.listData = [];
      this.loading = false;
      this.noMore = false;
      this.getListData();
    },
    getListData() {
      let param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        status: this.activeTab,
        synchronizationType: this.synchronizationType,
      };
      console.log("onload====", param);
      // await ...
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        // mock start
        let listData = [
          {
            status: "1",
            time: "2021-05-24 14:46:59",
            changeTxt: `名称由营运点南山分店 变更为 营运点南山分点2`,
            headTxt: `${this.pageNum}营运点南山分店`,
          },
          {
            status: "2",
            time: "2021-05-20 14:46:59",
            changeTxt: "时间由 18：00 变更为 20：00",
            headTxt: `${this.pageNum}营运点南山分店`,
          },
          {
            status: "3",
            time: "2021-05-14 14:46:59",
            changeTxt: "地址由 营运点南山分店 变更为 营运点南山分点2",
            headTxt: `${this.pageNum}营运点南山分店`,
          },
          {
            status: "3",
            time: "2021-05-14 14:46:59",
            changeTxt: "地址由 营运点南山分店 变更为 营运点南山分点4",
            headTxt: `${this.pageNum}营运点南山分店`,
          },
          {
            status: "3",
            time: "2021-05-14 14:46:59",
            changeTxt: "地址由 营运点南山分店 变更为 营运点南山分点5",
            headTxt: `${this.pageNum}营运点南山分店`,
          },
        ];
        listData = [...listData, ...listData];
        if (this.pageNum === 4) {
          listData = [listData[0]];
        }
        this.totalNum = 31;
        this.listData = [...this.listData, ...listData];
        // mock end
        if (this.listData.length >= this.totalNum) {
          this.noMore = true;
        } else {
          this.noMore = false;
          this.pageNum++;
        }
      }, 2000);
    },
    handleClickTabs(v) {
      console.log("====", v, this.synchronizationType);
      this.pageNum = 1;
      this.listData = [];
      this.loading = false;
      this.noMore = false;
      this.getListData();
    },
    batchStatusChange(status) {
      console.log("batchStatusChange");
      console.log("====", status, this.synchronizationType);
    },
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },
  watch: {
    setAuthority: {
      handler(n, o) {},
      immediate: true,
    },
  },
});
