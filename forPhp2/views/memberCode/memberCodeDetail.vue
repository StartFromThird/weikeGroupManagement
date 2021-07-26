<template>
  <div class="page member-code-detail p-24">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
      <!-- 概览 -->
      <el-tab-pane label="概览" name="1">
        <div class="pane-overview pane-wrap m-t-16 p-24">
          
          <div class="pane-overview-head">
            <div class="overview-r1 flex-row m-b-24">
              <div class="overview-code m-r-16">
                <!-- <el-image
                  style="width: 100px; height: 100px"
                  :src="overview.code_img"
                  fit="fit"
                ></el-image> -->
                <img style="width: 100px; height: 100px"
                  :src="overview.code_img"
                  fit="fit"
                />
              </div>
              <div class="flex-1">
                <div class="name">{{ overview.code_name || "--" }}</div>
                <div class="desc">{{ overview.code_description || "--" }}</div>
                <div>
                  <el-button
                    size="small"
                    type="primary"
                    @click="
                      simplyDownload(overview.code_img, overview.code_img_name)
                    "
                    >下载二维码</el-button
                  >
                  <el-button
                    class="copy-code-url-btn"
                    size="small"
                    @click="
                      handleCopyTxt(
                        overview.code_url,
                        '.copy-code-url-btn',
                        '.copy-code-url-target'
                      )
                    "
                    data-clipboard-action="copy"
                    data-clipboard-target="div"
                    >复制链接</el-button
                  >
                  <div class="copy-code-url-target fs-0">
                    {{ overview.code_url }}
                  </div>
                </div>
              </div>
            </div>
            <div class="overview-r2">
              <transition name="el-zoom-in-top">
                <el-row :gutter="24" class="overview-r2-row">
                  <el-col :span="8">
                    <div class="grid-content">
                      <div class="title">关联客户标签</div>
                      <div
                        :class="[
                          overviewCollapse ? 'content' : 'content fill-content',
                        ]"
                      >
                        <div
                          :class="[
                            overviewCollapse ? 'limit-height' : 'fill-height',
                          ]"
                        >
                          <template v-if="tagList && tagList.length">
                            <div
                              v-for="(tag, index) in tagList"
                              :key="index"
                              :class="[
                                'table-row-tag-item',
                                `table-row-tag-item-${tag.group_tag_type}`,
                              ]"
                            >
                              <div class="left tag-txt">
                                {{ tag.group_name }}
                              </div>
                              <div class="right">
                                <div class="right-txt tag-txt">
                                  {{ tag.tag_name }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <div v-else class="no-grid-content">暂无内容</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div class="title">欢迎语</div>
                      <div
                        :class="[
                          overviewCollapse ? 'content' : 'content fill-content',
                          'welcome-txt',
                        ]"
                      >
                        <div
                          v-if="
                            overview.welcome_msg_data &&
                            overview.welcome_msg_data.text_message
                          "
                          class="grid-content-welcome-wrap"
                          :class="[
                            overviewCollapse ? 'limit-height' : 'fill-height', 
                          ]"
                        >
                          {{ overview.welcome_msg_data.text_message }}
                        </div>
                        <div v-else class="no-grid-content">暂无内容</div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content">
                      <div class="title">附件</div>
                      <div
                        :class="[
                          overviewCollapse ? 'content' : 'content fill-content',
                          ''
                        ]"
                      >
                        <div
                          :class="[
                            overviewCollapse ? 'limit-height' : 'fill-height',
                            otherContentList && otherContentList.length ? '' : 'h-100percent'
                          ]"
                          class="other-content-wrap flex-row flex-wrap"
                        >
                          <template
                            v-if="otherContentList && otherContentList.length"
                          >
                            <div
                              v-for="(
                                contentItem, contentIndex
                              ) in otherContentList"
                              :key="contentIndex"
                              :class="[
                                'other-content-item-wrap',
                                contentIndex % 2 === 0 ? 'p-r-4' : 'p-l-4',
                              ]"
                            >
                              <div
                                v-if="!(overviewCollapse && contentIndex > 1)"
                                class="
                                  other-content-item
                                  flex-row flex-col-center
                                "
                              >
                                <div class="left m-r-8">
                                  <!-- 视频缩略图 url、其他 upload_url -->
                                  <el-image
                                    v-if="contentItem.type != 4"
                                    style="width: 44px; height: 44px"
                                    :src="contentItem.upload_url"
                                    :preview-src-list="[contentItem.upload_url]"
                                  >
                                    <div slot="error" class="image-err-slot">
                                      <i class="el-icon-picture-outline"></i>
                                    </div>
                                  </el-image>
                                  <video
                                    style="width: 44px; height: 44px"
                                    v-if="contentItem.media_url"
                                    fit="fill"
                                    :src="contentItem.media_url"
                                  ></video>
                                </div>
                                <div class="right overflow-ellipsis">
                                  <div class="title overflow-ellipsis">
                                    {{
                                      contentItem.title ||
                                      (contentItem.type == 1
                                        ? "图片消息"
                                        : contentItem.type == 4
                                        ? "视频消息"
                                        : "-")
                                    }}
                                  </div>
                                  <div
                                    class="desc overflow-ellipsis"
                                    v-if="['3', '2'].includes(contentItem.type)"
                                  >
                                    {{ contentItem.description || "-" }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <div v-else class="no-grid-content">暂无内容</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </transition>
              <div
                class="right-collapse cursor-pointer"
                @click="handleCollapseChange"
              >
                <template v-if="overviewCollapse">
                  <span>展开</span>
                  <i class="el-icon-arrow-down"></i>
                </template>
                <template v-else>
                  <span>收起</span>
                  <i class="el-icon-arrow-up"></i>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="pane-chart m-t-24">
          <div
            class="
              pane-chart-title
              p-l-24 p-r-24
              flex-row flex-row-between flex-col-center
            "
          >
            <div class="pane-chart-title-left">数据明细</div>
            <div class="pane-chart-right flex-row flex-col-center">
              <el-dropdown size="small" @command="handleCommandTimeType">
                <div class="el-dropdown-link cursor-pointer">
                  {{ currentTimeType
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in timeTypeOption"
                    :command="item"
                    :key="index + item"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="seperate"></div>
              <div class="fs-14">自定义：</div>
              <el-date-picker
                size="mini"
                v-model="timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="timeRangeChange"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="pane-chart-content">
            <div id="chart" class="chart">
              <div id="chart" class="chart"></div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 成员活码规则 -->
      <el-tab-pane label="成员活码规则" name="2">
        <div class="pane-rule pane-wrap">
          <div class="pane-title flex-col-center flex-row-between">
            <div class="pane-title-left">活码规则配置</div>
            <div class="flex-row flex-col-center">
              <el-button size="mini" @click="addRule"> 新建规则 </el-button>
              <el-popover
                placement="bottom-start"
                title="说明：引流规则只允许选择一条生效规则"
                width="280"
                trigger="hover"
                popper-class="tip-title-popover"
              >
                <img
                  slot="reference"
                  class="tip-icon m-l-8"
                  src="../../static/image/common/info.png"
                />
              </el-popover>
            </div>
          </div>
          <div class="p-b-24">
            <member-code-rule ref="memberCodeRule"> </member-code-rule>
          </div>
        </div>
      </el-tab-pane>
      <!-- 引流记录 -->
      <el-tab-pane label="引流记录" name="3">
        <div class="pane-record pane-wrap">
          <div class="pane-title flex-row flex-col-center">
            <div class="pane-title-left">
              当前有 {{ record.drainage_total_num || "0" }} 个客户人次，共
              {{ record.drainage_user_num || "0" }} 个客户
            </div>
          </div>
          <div class="record-table-wrap">
            <el-table
              :data="record.record_list"
              style="width: 100%"
              size="mini"
            >
              <el-table-column
                label="规则名称"
                prop="rule_name"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.rule_name || "--" }}
                </template>
              </el-table-column>
              <el-table-column label="客户信息" min-width="140px">
                <template slot-scope="scope">
                  <div class="custom-info-cell flex-row flex-col-center">
                    <el-avatar
                      class="info-avatar"
                      shape="square"
                      :size="32"
                      :src="scope.row.qw_avatar"
                    >
                      <img
                        src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                      />
                    </el-avatar>
                    <div class="info-name overflow-ellipsis">
                      {{ scope.row.qw_external_name || "--" }}
                    </div>
                    <div class="info-type" v-if="scope.row.qw_type === '1'">
                      @微信
                    </div>
                    <div
                      class="info-type info-type-2"
                      v-else-if="scope.row.qw_type === '2'"
                    >
                      @企微
                    </div>
                    <img
                      src="../../static/image/common/man.png"
                      class="sex-icon"
                      alt=""
                      v-if="scope.row.qw_gender === '1'"
                    />
                    <img
                      src="../../static/image/common/women.png"
                      class="sex-icon"
                      alt=""
                      v-if="scope.row.qw_gender === '2'"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作/关系"
                prop="deleted_state"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.deleted_state || "--" }}
                </template>
              </el-table-column>
              <el-table-column
                label="添加时间"
                prop="add_date"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.add_date || "--" }}
                </template>
              </el-table-column>
              <el-table-column
                label="跟进成员"
                prop="member_name"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.member_name || "--" }}
                </template>
              </el-table-column>
              <el-table-column label="关联客户标签" width="620px">
                <template slot-scope="scope">
                  <tag-in-table-cell :tag-list="scope.row.tag_list">
                  </tag-in-table-cell>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleListItemDetail(scope.row, scope.index)"
                    >查看详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="table-pagination-wrap flex-row-end p-t-24 p-b-24">
              <el-pagination
                v-if="record && record.record_list.length"
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
const { Area } = G2Plot;
module.exports = {
  name: "member-code-detail",
  data() {
    return {
      id: "",
      activeTab: "1",
      overview: {},
      otherContentList: [],
      tagList: [],
      overviewCollapse: true,
      timeRange: [],
      timeTypeOption: ["按月", "按周", "按日"],
      currentTimeType: "",
      area: null,
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = "";
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== "") {
            const day30 = (30 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day30;
            let minTime = this.pickerMinDate - day30;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return time.getTime() > maxTime || time.getTime() < minTime;
          }
          return time.getTime() > Date.now();
        },
      },
      record: {
        record_list: [],
      },
      pageSize: 10,
      pageNo: 1,
      pageSizes: [10, 15, 20],
      totalNo: 0,
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    substringByByte3,
    simplyDownload,
    copyTxt,
    getQueryVariable,
    handleClick(v) {
      console.log("tab切换==", v.name);
      switch (v.name) {
        case "1":
          this.initOverview();
          this.initChart();
        case "2":
          if (this.$refs.memberCodeRule) {
            this.$refs.memberCodeRule.initRuleTable();
          }
          break;
        case "3":
          this.initRecord();
        default:
          break;
      }
    },
    initPage() {
      this.id = this.getQueryVariable("id");
      console.log("id====", this.id);
      this.handleClick({ name: this.activeTab });
    },
    // 概览
    initOverview() {
      this.overviewCollapse = true;
      let overview = {
        code_name: "十一国庆节",
        code_description:
          "六一儿童节的成员活码六一儿童节的成员活码六一儿童节的成员活码六一儿童节的成员活码六一儿童节的成员活码1",
        // code_img: "/upload/2021/07/21/fuq9beXx2BlS.png",
        code_img: "https://www.baidu.com/img/flexible/logo/pc/result.png",
        code_url: "http://127.0.0.1/member_code/code/25",
        is_tag: "1",
        is_welcome: "1",
        welcome_msg_data: {
          text_message: 
            "则默认发送成员欢迎语则默认发送成员欢迎语则默认发送成员欢迎语，如无成员😂😂😂😅🤩🤩🙉🐰  dasdas",
          is_exist_data: true,
        },
      };
      if (overview && overview.code_img) {
        let sArr = overview.code_img.split("/");
        overview.code_img_name = sArr[sArr.length - 1];
      }
      if (
        overview &&
        overview.welcome_msg_data &&
        overview.welcome_msg_data.attachment_data &&
        Array.isArray(overview.welcome_msg_data.attachment_data) &&
        overview.welcome_msg_data.attachment_data.length
      ) {
        this.otherContentList = overview.welcome_msg_data.attachment_data;
      }
      this.otherContentList = [
        {
          type: "1",
          upload_url:
            "https://wework.qpic.cn/wwpic/212678_8O69N1EhSneCHnx_1626850378/0",
        },
        {
          type: "4",
          upload_url: "",
          media_url:
            "https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=7m5EhBs11Vk59TYw6YyvIUdNOUbK-gzJDYxvKqFxZM0HVKgpY-fXu4MzXrAzQUVMyKacsGs313QW4OvCj8Ql9O19CBad01AKGtpJaR4tJq039NxWxpkt7u4qtvUfvtJECArAWXx3rXR1GoFVtl8ZekJDw3JP5u3RtKJ6GF3sZpjn-Lakn_cxofMDwny9qfv1anS8-FW31sUbwH2lii0B2g&media_id=3y66ovKwjgDFwzXgFaHKR4jCBEEs1QE-LQdy6B7Iueh4uoe1VIzagNhFewVBYzQdv",
          source_id: "26",
        },
        {
          type: "3",
          title: "qk",
          description: "https://control-workwechat-k8s.test.freshgood.cn/",
          url: "https://control-workwechat-k8s.test.freshgood.cn/",
          upload_url:
            "https://wework.qpic.cn/wwpic/196302_m4jNs13BTXCK9nS_1626850406/0",
        },
        {
          type: "2",
          upload_url:
            "https://control-workwechat-k8s.test.freshgood.cn/upload/source_2021/07/21/3FP2s6QhI1nTuyANxzU9r7vVtMdDCeim.png",
          title: "小程序标题：小程序标题：",
          url: "小程序Appid小程序Appid",
          source_id: "53",
          appid: "AppidAppidAppid",
        },
      ];
      // this.otherContentList = [];
      this.overview = overview;
      this.tagList = [
        {
          group_name:
            "总部标签组名称总部标签组名称总部标签组名称总部标签组名称",
          tag_name: "标签名",
          group_tag_type: "HQ",
          succ_class_num: "1",
        },
        {
          group_name: "一二三四五六七八九十",
          tag_name: "一十六",
          group_tag_type: "SERVICE",
          succ_class_num: "2",
        },
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
      ];
      // this.tagList = [];
    },
    handleCollapseChange() {
      this.overviewCollapse = !this.overviewCollapse;
      let r = document.querySelector(".overview-r2-row");
      if (!this.overviewCollapse) {
        this.$nextTick(() => {
          let h = document.querySelector(".overview-r2").offsetHeight;
          r.style.height = `${h}px`;
          console.log(h);
        });
      } else {
        r.style.height = `auto`;
      }
    },
    async handleCopyTxt(txt, act, target) {
      let t = await this.copyTxt(txt, act, target);
      if (t) {
        this.$message({
          message: "已复制",
          type: "success",
        });
      }
    },
    handleCommandTimeType(e) {
      console.log(e);
      this.currentTimeType = e;
      switch (e) {
        case "按日":
          this.lastDay();
          break;
        case "按周":
          this.lastWeek();
          break;
        case "按月":
          this.lastMonth();
          break;
        default:
          break;
      }
    },
    // 堆积面积图
    initChart() {
      this.currentTimeType = this.timeTypeOption[0];
      this.lastMonth();
    },
    lastDay() {
      let base = new Date(new Date().getTime() - 3600 * 24 * 1 * 1000).format("yyyy-MM-dd");
      let start = `${base} 00:00:00`;
      let end = `${base} 23:59:59`;
      this.timeRange = [start, end];
      this.getChartData();
    },
    lastWeek() {
      let start = new Date().getTime() - 3600 * 24 * 7 * 1000;
      let end = new Date().getTime() - 3600 * 24 * 1 * 1000;
      start = new Date(start).format("yyyy-MM-dd hh:mm:ss");
      end = new Date(end).format("yyyy-MM-dd hh:mm:ss");
      this.timeRange = [start, end];
      this.getChartData();
    },
    lastMonth() {
      let start = new Date().getTime() - 3600 * 24 * 30 * 1000;
      let end = new Date().getTime() - 3600 * 24 * 1 * 1000;
      start = new Date(start).format("yyyy-MM-dd hh:mm:ss");
      end = new Date(end).format("yyyy-MM-dd hh:mm:ss");
      this.timeRange = [start, end];
      this.getChartData();
      console.log(start, end);
    },
    timeRangeChange() {
      console.log(this.timeRange);
      this.getChartData();
    },
    getChartData() {
      // 初始化参数
      // fetch(
      //   "https://gw.alipayobjects.com/os/bmw-prod/b21e7336-0b3e-486c-9070-612ede49284e.json"
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     const area = new Area("chart", {
      //       data,
      //       xField: "date",
      //       yField: "value",
      //       seriesField: "country",
      //     });
      //     area.render();
      //   });
      const data = [
        {
          type: "扫码次数",
          date: "2021-07-21",
          value: 24,
        },
        {
          type: "添加人数",
          date: "2021-07-21",
          value: 37,
        },

        {
          type: "添加人数",
          date: "2021-07-22",
          value: 62,
        },
        {
          type: "扫码次数",
          date: "2021-07-22",
          value: 60,
        },
        {
          type: "添加人数",
          date: "2021-07-23",
          value: 17,
        },
        {
          type: "扫码次数",
          date: "2021-07-23",
          value: 11,
        },
        {
          type: "添加人数",
          date: "2021-07-24",
          value: 22,
        },
        {
          type: "扫码次数",
          date: "2021-07-24",
          value: 18,
        },
      ];
      if (this.area) {
        console.log("更新图表");
        this.area.update({ data });
      } else {
        this.area = new Area("chart", {
          data,
          smooth: true,
          xField: "date",
          yField: "value",
          seriesField: "type",
          color: ({ type }) => {
            if (type === "扫码次数") {
              return "#1773FA";
            }
            return "#FF6F00";
          },
        });
        this.area.render();
      }
    },
    // 规则
    addRule() {
      this.$refs.memberCodeRule.handleAddRule();
    },
    // 引流记录
    initRecord() {
      this.recordPageNo = 1;
      this.getRecordData();
    },
    getRecordData() {
      console.log("请求引流记录=====");
      this.record = {
        current_page: "1",
        total_page_num: 3,
        drainage_total_num: 150,
        drainage_user_num: 120,
        record_list: [
          {
            rule_name: "1六一活动节",
            member_name: "林金涛",
            qw_external_name: "霜",
            qw_gender: "1",
            deleted_state: "互为好友",
            qw_createtime: 1618213158,
            qw_avatar:
              "http://wx.qlogo.cn/mmhead/Xmnun9Io49QUtqYpcxYKs8sMibVYiasNTlS980txlb6BfTAhl9bTQpGw/0",
            qw_type: "1",
            add_date: "2021-04-12 15: 39: 18",
            tag_list: [
              {
                group_name:
                  "总部标签组名称总部标签组名称总部标签组名称总部标签组名称",
                tag_name: "标签名",
                group_tag_type: "HQ",
                succ_class_num: "1",
              },
              {
                group_name: "一二三四五六七八九十",
                tag_name: "一十六",
                group_tag_type: "SERVICE",
                succ_class_num: "2",
              },
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
            rule_name: "2六一活动节 ",
            member_name: "林金涛 ",
            qw_external_name: "姚杨 kiki ",
            qw_gender: "1",
            deleted_state: "互为好友",
            qw_createtime: 1625544607,
            qw_avatar:
              "http://wx.qlogo.cn/mmhead/Q3auHgzwzM6uk51ic9K9lYS34cVesO6NaDvwvwHWaNGxg7JbSfscGOQ/0",
            qw_type: "1",
            add_date: "2021-07-06 12: 10: 07 ",
          },
          {
            rule_name: "3六一活动节 ",
            member_name: "",
            qw_external_name: "Frank - Fu ",
            qw_gender: "1",
            deleted_state: "客户删除成员 ",
            qw_createtime: 1612409280,
            qw_avatar:
              "http://wx.qlogo.cn/mmhead/PiajxSqBRaEJXrOjw5YwvM2iaibRibt07VZszqAHibeCNNzcMontkbHaOyQ/0",
            qw_type: "1",
            add_date: "2021-02-04 11: 28: 00 ",
          },
          {
            rule_name: "4444长长长长长长长长长",
            member_name: "aaa",
            qw_external_name: "一二三四五六七八九十",
            qw_gender: "2",
            deleted_state: "客户删除成员 ",
            qw_createtime: 1612409280,
            qw_avatar:
              "http://wx.qlogo.cn/mmhead/1PiajxSqBRaEJXrOjw5YwvM2iaibRibt07VZszqAHibeCNNzcMontkbHaOyQ/0",
            qw_type: "2",
            add_date: "2021-02-04 11: 28: 00 ",
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
        ],
      };
      this.totalNo = this.record.total_page_num;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getRecordData();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getRecordData();
    },
    handleListItemDetail(row, i) {
      // location.href = `./memberCodeDetail.html?id=${row.id}`;
    },
  },

  components: {
    "member-code-rule": httpVueLoader("./components/memberCodeRule.vue"),
    "tag-in-table-cell": httpVueLoader(
      "../components/tagInTableCell/tagInTableCell.vue"
    ),
  },
};
</script>
<style>
@import url("../../static/tag/tagItemList.css");
</style>
<style scoped>
@import url("../../static/memberCode/memberCodeDetail.css");
</style>
