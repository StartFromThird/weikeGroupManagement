<template>
  <div class="welcome-text-and-file">
    <div
      :class="[
        'text-emoji-content-wrap',
        curContentErr ? 'fake-border__error' : 'm-b-8',
      ]"
    >
    <div style="position: relative;">
      <el-input
        id="editContent"
        type="textarea"
        v-model="info.content"
        placeholder="请输入内容"
        :autosize="{ minRows: 10 }"
        @blur="validTextEmojiContent(info.content, 20)"
      >
      </el-input>
      <div class="emoji-btn" @click="addEmojiPopover(info)">
        <img src="../../../static/image/common/emoji@2x.png" alt="表情包" />
      </div>
    </div>
      <el-collapse-transition>
        <div class="emoji-popover-wrap" v-show="info.emojiPopoverVisible">
          <!-- :label="emojiGroup.name" -->
          <el-tabs v-model="emojiTab">
            <el-tab-pane
              v-for="(emojiGroup, emojiIndex) in emojiList"
              :key="emojiIndex"
              
              :name="emojiGroup.label"
              style="height: 200px; overflow: auto"
            >
              <span slot="label" class="emoji-tab-label"> {{emojiGroup.name}} </span>
              <div class="emoji-box">
                <div
                  v-for="(subItem, subIndex) in emojiGroup.value"
                  :key="subIndex"
                  @click="insertText(subItem, info)"
                >
                  <span>{{ subItem }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-collapse-transition>
    </div>
    <div v-if="curContentErr" class="fake-el-form-item__error m-b-8">
      输入内容过长
    </div>
    <!-- 附件列表 -->
    <div class="other-content-wrap">
      <div
        class="other_content_item"
        v-for="(contentItem, contentIndex) in info.other_content_list"
        :key="contentIndex"
      >
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
        <div class="middle-txt">
          <div class="title overflow-ellipsis">
            {{
              contentItem.title ||
              (contentItem.type == 1
                ? "图片"
                : contentItem.type == 4
                ? "视频"
                : "-")
            }}
          </div>
          <div
            class="desc overflow-ellipsis"
            v-if="[3, 2].includes(contentItem.type)"
          >
            {{ contentItem.description || "-" }}
          </div>
        </div>
        <div class="right-operate">
          <div class="right-operate-btn right-operate-success">
            <i class="el-icon-success"></i>
          </div>
          <div
            class="right-operate-btn right-operate-del"
            @click="delOtherContentList(info.other_content_list, contentIndex)"
          >
            <i class="el-icon-delete-solid"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传附件弹窗 -->
    <el-popover
      v-model="addOtherContentVisible"
      placement="top"
      width="400"
      trigger="manual"
    >
      <div class="add-other-content-wrap">
        <div class="add-other-content-header">
          <span>选择添加附件类型</span>
          <i class="el-icon-close" @click="addOtherContentVisible = false"> </i>
        </div>
        <div class="add-other-content-main">
          <div class="add-other-content-item" @click="addPic">
            <img
              src="../../../static/image/common/otherContent1@2x.png"
              alt="图片"
            />
            <span>图片</span>
          </div>
          <div class="add-other-content-item" @click="addVideo">
            <img
              src="../../../static/image/common/otherContent2@2x.png"
              alt="视频"
            />
            <span>视频</span>
          </div>
          <div class="add-other-content-item" @click="addWebPage">
            <img
              src="../../../static/image/common/otherContent3@2x.png"
              alt="网页"
            />
            <span>网页</span>
          </div>
          <div class="add-other-content-item" @click="addWechatApp">
            <img
              src="../../../static/image/common/otherContent4@2x.png"
              alt="小程序"
            />
            <span>小程序</span>
          </div>
        </div>
      </div>
      <el-button
        @click="addOtherContent"
        slot="reference"
        type="primary"
        style="width: 100%"
        size="small"
        :disabled="
          info.other_content_list && info.other_content_list.length == 9
            ? true
            : false
        "
      >
        + 添加图片/视频/网页/小程序
      </el-button>
    </el-popover>
    <!-- 网页附件 -->
    <el-dialog
      title="添加网页消息"
      :visible.sync="webPageDialogVisible"
      custom-class="sop-add-other-content-dialog"
      width="400px"
    >
      <el-form
        :model="webPageForm"
        :rules="webPageRules"
        ref="webPageForm"
        label-width="100px"
        label-position="top"
        size="mini"
      >
        <el-form-item label="网页标题：" prop="title">
          <el-input
            @input="
              webPageForm.title = webPageForm.title.replace(noEmojiReg, '')
            "
            v-model="webPageForm.title"
            type="textarea"
            placeholder="请输入标题（最长128个字节）"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="网页封面：" prop="upload_url">
          <el-upload
            action="/cw_message_group_send/upload"
            :multiple="false"
            accept="image/jpg, image/jpeg, image/bmp, image/gif, image/png"
            :show-file-list="false"
            :on-success="
              (response, file, fileList) =>
                handleImgUploadSuccess(response, file, fileList, 'webPageForm')
            "
            :on-error="
              (err, file, fileList) =>
                handleImgUploadErr(err, file, fileList, 'webPageForm')
            "
            :before-upload="beforeImgUpload"
          >
            <el-image
              style="width: 100px; height: 100px"
              v-if="webPageForm.upload_url"
              fit="fill"
              :src="webPageForm.upload_url"
            ></el-image>
            <div class="uploader" slot="trigger" v-if="!webPageForm.upload_url">
              <i class="el-icon-plus uploader-icon"></i>
              <span>点击上传</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="网页描述：" prop="description">
          <el-input
            @input="
              webPageForm.description = webPageForm.description.replace(
                noEmojiReg,
                ''
              )
            "
            v-model="webPageForm.description"
            type="textarea"
            placeholder="请输入描述（最多512个字节）"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="网页链接：" prop="url">
          <el-input
            @input="webPageForm.url = webPageForm.url.replace(noEmojiReg, '')"
            v-model="webPageForm.url"
            type="textarea"
            placeholder="请输入链接（最长2048个字节）"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelAddWebPage">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAddWebPage"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <!-- 小程序附件 -->
    <el-dialog
      title="添加小程序消息"
      :visible.sync="wechatAppDialogVisible"
      custom-class="sop-add-other-content-dialog"
      width="400px"
    >
      <el-form
        :model="wechatAppForm"
        :rules="wechatAppRules"
        ref="wechatAppForm"
        label-width="100px"
        label-position="top"
        size="mini"
        v-if="addWechatAppType == 0"
      >
        <el-form-item label="小程序标题：" prop="title">
          <el-input
            @input="
              wechatAppForm.title = wechatAppForm.title.replace(noEmojiReg, '')
            "
            v-model="wechatAppForm.title"
            type="textarea"
            placeholder="请输入标题（最多64个字节）"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="小程序封面：" prop="upload_url">
          <el-upload
            action="/api_cw_sources/add"
            :data="mini_info"
            :multiple="false"
            accept="image/jpg, image/jpeg, image/bmp, image/gif, image/png"
            :show-file-list="false"
            :on-success="
              (response, file, fileList) =>
                handleImgUploadSuccess(
                  response,
                  file,
                  fileList,
                  'wechatAppForm',
                  'miniapp'
                )
            "
            :on-error="
              (err, file, fileList) =>
                handleImgUploadErr(err, file, fileList, 'wechatAppForm')
            "
            :before-upload="beforeImgUpload"
          >
            <el-image
              style="width: 100px; height: 100px"
              v-if="wechatAppForm.upload_url"
              fit="fill"
              :src="wechatAppForm.upload_url"
            ></el-image>
            <div class="uploader" v-else>
              <i class="el-icon-plus uploader-icon"></i>
              <span class="action-txt">点击上传</span>
              <span class="tip">封面图建议尺寸为520*416</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="小程序Appid：" prop="appid">
          <p style="font-size: 12px; color: red; line-height: 22px">
            提示：请确认小程序已绑定相应的企业微信，且appid一定准确，否则消息将推送失败
          </p>
          <el-input
            @input="
              wechatAppForm.appid = wechatAppForm.appid
                .replace(noEmojiReg, '')
                .replace(/[^a-zA-Z0-9]/g, '')
            "
            v-model="wechatAppForm.appid"
            type="textarea"
            placeholder="请输入小程序Appid"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="小程序Page路径：" prop="url">
          <el-input
            @input="
              wechatAppForm.url = wechatAppForm.url.replace(noEmojiReg, '')
            "
            v-model="wechatAppForm.url"
            type="textarea"
            placeholder="请输入小程序Page路径"
            :autosize="{ minRows: 2 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :model="wechatAppForm"
        ref="wechatAppForm"
        label-width="100px"
        label-position="top"
        v-if="addWechatAppType == 1"
        size="mini"
      >
        <el-form-item label="选择小程序：">
          <el-select
            size="mini"
            class="w-100percent"
            v-model="minipro_id"
            placeholder="请选择"
            clearable
          >
            <template v-for="(item, index) in appOptions">
              <el-option
                :label="item.title"
                :value="index + 1"
                :key="index"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="小程序封面：" prop="upload_url">
          <el-upload
            action="/api_cw_sources/add"
            :data="mini_info"
            :multiple="false"
            accept="image/jpg, image/jpeg, image/bmp, image/gif, image/png"
            :show-file-list="false"
            :on-success="
              (response, file, fileList) =>
                handleImgUploadSuccess(
                  response,
                  file,
                  fileList,
                  'wechatAppForm',
                  'miniapp'
                )
            "
            :on-error="
              (err, file, fileList) =>
                handleImgUploadErr(err, file, fileList, 'wechatAppForm')
            "
            :before-upload="beforeImgUpload"
          >
            <el-image
              style="width: 100px; height: 100px"
              v-if="wechatAppForm.upload_url"
              fit="fill"
              :src="wechatAppForm.upload_url"
            ></el-image>
            <div class="uploader" v-else>
              <i class="el-icon-plus uploader-icon"></i>
              <span class="action-txt">点击上传</span>
              <span class="tip">封面图建议尺寸为520*416</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span
        style="color: #1773fa; cursor: pointer"
        v-if="addWechatAppType == 0"
        @click="changeAddWechatAppType(1)"
        >选择添加的小程序</span
      >
      <span
        style="color: #1773fa; cursor: pointer"
        v-if="addWechatAppType == 1"
        @click="changeAddWechatAppType(0)"
        >自定义配置小程序</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelWechatApp">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmWechatApp"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <!-- 图片附件 -->
    <el-dialog
      title="添加图片"
      :visible.sync="picDialogVisible"
      custom-class="sop-add-other-content-dialog"
      width="400px"
    >
      <el-form
        :model="picForm"
        :rules="picRules"
        ref="picForm"
        label-width="100px"
        label-position="top"
        size="mini"
      >
        <el-form-item label="" prop="upload_url">
          <el-upload
            action="/cw_message_group_send/upload"
            :multiple="false"
            accept="image/jpg, image/jpeg, image/bmp, image/gif, image/png"
            :show-file-list="false"
            :on-success="
              (response, file, fileList) =>
                handleImgUploadSuccess(response, file, fileList, 'picForm')
            "
            :on-error="
              (err, file, fileList) =>
                handleImgUploadErr(err, file, fileList, 'picForm')
            "
            :before-upload="beforeImgUpload"
          >
            <el-image
              style="width: 100px; height: 100px"
              v-if="picForm.upload_url"
              fit="fill"
              :src="picForm.upload_url"
            ></el-image>
            <div class="uploader" slot="trigger" v-if="!picForm.upload_url">
              <i class="el-icon-plus uploader-icon"></i>
              <span>点击上传</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelAddPic">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAddPic"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <!-- 视频附件 -->
    <el-dialog
      title="添加视频"
      :visible.sync="videoDialogVisible"
      custom-class="sop-add-other-content-dialog"
      width="400px"
    >
      <el-form
        :model="videoForm"
        :rules="videoRules"
        ref="videoForm"
        label-width="100px"
        label-position="top"
        size="mini"
      >
        <el-form-item label="视频" prop="media_url">
          <el-upload
            action="/api_cw_sources/add"
            :data="video_info"
            :multiple="false"
            accept="video/mp4"
            :show-file-list="false"
            :on-success="
              (response, file, fileList) =>
                handleImgUploadSuccess(
                  response,
                  file,
                  fileList,
                  'videoForm',
                  'vedio'
                )
            "
            :on-error="
              (err, file, fileList) =>
                handleImgUploadErr(err, file, fileList, 'videoForm')
            "
            :before-upload="beforeVideoUpload"
          >
            <video
              style="width: 100px; height: 100px"
              v-if="videoForm.media_url"
              fit="fill"
              :src="videoForm.media_url"
            ></video>
            <div class="uploader" slot="trigger" v-if="!videoForm.media_url">
              <i class="el-icon-plus uploader-icon"></i>
              <span>点击上传</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelAddVideo">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAddVideo"
          >确 认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "welcome-text-and-file",
  props: {
    writeBackWelcome: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      info: {
        content: "",
        emojiPopoverVisible: false,
        other_content_list: [],
      },
      curContentErr: false,
      // emoji
      emojiList,
      emojiTab: "face",
      timer: null,
      noEmojiReg:
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
      // 附件
      addOtherContentVisible: false,
      // 附件 网页
      webPageDialogVisible: false,
      webPageForm: {},
      baseWebPageForm: {
        type: 3,
        title: "",
        description: "",
        url: "",
        upload_url: "",
      },
      webPageRules: {
        title: [
          { required: true, message: "请输入网页标题", trigger: "blur" },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 128),
            trigger: ["blur", "change"],
          },
        ],
        description: [
          { required: true, message: "请输入网页描述", trigger: "blur" },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 512),
            trigger: ["blur", "change"],
          },
        ],
        url: [
          { required: true, message: "请输入网页链接", trigger: "blur" },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 2048),
            trigger: ["blur", "change"],
          },
        ],
      },
      // 附件 小程序
      wechatAppDialogVisible: false,
      wechatAppForm: {},
      baseWechatAppForm: {
        type: 2,
        upload_url: "",
        title: "",
        url: "",
        source_id: 0,
        appid: "",
      },
      wechatAppRules: {
        title: [
          { required: true, message: "请输入小程序标题", trigger: "blur" },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 64),
            trigger: ["blur", "change"],
          },
        ],
        upload_url: [
          {
            required: true,
            message: "请上传小程序封面",
            trigger: "change",
          },
        ],
        appid: [
          { required: true, message: "请输入小程序Appid", trigger: "blur" },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 32),
            trigger: ["blur", "change"],
          },
        ],
        url: [
          {
            required: true,
            message: "请输入小程序Page路径",
            trigger: "blur",
          },
          {
            required: true,
            validator: (rule, value, callback) =>
              this.validateLimitByteLen(rule, value, callback, 1024),
            trigger: ["blur", "change"],
          },
        ],
      },
      addWechatAppType: 0,
      appOptions: [],
      minipro_id: "",
      //上传图片
      picDialogVisible: false,
      picForm: {},
      basePicForm: {
        type: 1,
        upload_url: "",
      },
      picRules: {
        upload_url: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
      },
      //上传视频
      videoDialogVisible: false,
      videoForm: {},
      baseVideoForm: {
        type: 4,
        upload_url: "",
        media_url: "",
        source_id: 0,
      },
      videoRules: {
        media_url: [
          {
            required: true,
            message: "请上传视频",
            trigger: "change",
          },
        ],
        source_id: [
          {
            required: true,
            message: "请上传视频",
            trigger: "change",
          },
        ],
      },
      mini_info: {
        source_name: "小程序封面图",
        source_type: "1",
        validity_start_time: "2021-06-22",
        validity_end_time: "2021-06-25",
      },
      video_info: {
        source_name: "视频",
        source_type: "2",
        validity_start_time: "2021-06-22",
        validity_end_time: "2021-06-25",
      },
      otherContentLoading: null,
    };
  },
  methods: {
    getMiniprogramList() {
      let that = this;
      //   Admin.api.ajax({
      //   url: '/cw_message_group_send/get_miniprogram_list',
      //   async: true,
      //   type: 'post',
      //   data: {}
      // }, function (ret, res) {
      //     if (res.code == 0) {
      //       that.appOptions = res.data;
      //     }
      // });
      that.appOptions = [];
    },
    // 附件添加和关闭
    addOtherContent() {
      if (
        this.info.other_content_list &&
        this.info.other_content_list.length &&
        this.info.other_content_list.length > 8
      ) {
        this.$message({
          message: "添加附件不可超过9个",
          type: "warning",
        });
        return;
      }
      this.addOtherContentVisible = !this.addOtherContentVisible;
    },
    delOtherContentList(list, index) {
      list.splice(index, 1);
    },
    // 附件内容添加
    handleImgUploadSuccess(response, file, fileList, type, media_type = "") {
      console.log("上传成功=======", type, this[`${type}`]);
      if (this[`${type}`]) {
        // this[`${type}`]["upload_url"] =
        //   "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100";

        if (media_type == "vedio") {
          if (response.source_id == undefined) {
            this.$message({
              message: response.msg,
              type: "error",
            });
            this.$nextTick(() => {
              this.otherContentLoading.close();
            });
            return false;
          }
          // this[`${type}`]["url"] = response.media_id;
          this[`${type}`]["source_id"] = response.source_id;
          this[`${type}`]["media_url"] = response.url;
        } else if (media_type == "miniapp") {
          this[`${type}`]["upload_url"] = response.url;
          this[`${type}`]["source_id"] = response.source_id;
        } else {
          this[`${type}`]["upload_url"] = response.data;
        }
      }

      this.$nextTick(() => {
        this.otherContentLoading.close();
      });
    },
    handleImgUploadErr(err, file, fileList, type) {
      console.log("上传失败=======");
      this.$nextTick(() => {
        this.otherContentLoading.close();
      });
    },
    beforeVideoUpload(file) {
      this.sopLoading();

      const self = this;
      const isLt10MB = file.size / 1024 / 1024 < 10;

      if (!isLt10MB) {
        self.videoForm.upload_url = "";
        self.videoForm.media_url = "";
        self.videoForm.source_id = "";

        setTimeout(function () {
          self.otherContentLoading.close();
          self.$message({
            message: "上传视频大小不能超过10MB！",
            type: "error",
          });
        }, 500);
        return false;
      }
    },
    beforeImgUpload(file) {
      const isIMAGE = /\.(gif|jpg|jpeg|png|bpm|BPM|GIF|JPG|PNG|JPEG)$/.test(
        file.name
      );
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isIMAGE) {
        this.$message.error(
          "上传文件只能是 jpg，jpeg，bmp，gif，png 图片格式!"
        );
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      console.log(isIMAGE, file.type, isLt2M);

      if (isIMAGE && isLt2M) {
        this.sopLoading();
      }

      return isIMAGE && isLt2M;
    },
    // 附件加小程序
    changeAddWechatAppType(type) {
      this.addWechatAppType = type;
      this.wechatAppForm.upload_url = "";
      this.wechatAppForm.source_id = 0;
    },
    addWechatApp() {
      this.addOtherContentVisible = false;
      this.wechatAppForm = { ...this.baseWechatAppForm };
      this.$nextTick(() => {
        this.$refs.wechatAppForm.clearValidate();
      });
      this.wechatAppDialogVisible = true;
    },
    cancelWechatApp() {
      this.wechatAppDialogVisible = false;
    },
    confirmWechatApp() {
      if (this.addWechatAppType == 0) {
        //自定义小程序
        this.$refs["wechatAppForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          // let i = parseInt(this.editableTabsValue);
          if (!this.info.other_content_list) {
            this.info.other_content_list = [];
          }
          this.info.other_content_list.push(
            JSON.parse(JSON.stringify(this.wechatAppForm))
          );
          this.wechatAppDialogVisible = false;
        });
      } else {
        //选择小程序
        console.log("this.minipro_id", this.minipro_id);
        if (!this.minipro_id) {
          this.$message({
            message: "请选择小程序",
            type: "error",
          });
          return;
        }

        if (!this.wechatAppForm.upload_url) {
          this.$message({
            message: "请上传小程序封面图",
            type: "error",
          });
          return;
        }

        let datafrom = {};
        datafrom = this.appOptions[this.minipro_id - 1];
        datafrom["upload_url"] = this.wechatAppForm.upload_url;
        datafrom["source_id"] = this.wechatAppForm.source_id;

        // let i = parseInt(this.editableTabsValue);
        if (!this.info.other_content_list) {
          this.info.other_content_list = [];
        }
        this.info.other_content_list.push(JSON.parse(JSON.stringify(datafrom)));
        this.wechatAppDialogVisible = false;
      }
    },
    // 附件加网页
    cancelAddWebPage() {
      this.webPageDialogVisible = false;
    },
    confirmAddWebPage() {
      this.$refs["webPageForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        // let i = parseInt(this.editableTabsValue);
        if (!this.info.other_content_list) {
          this.info.other_content_list = [];
        }
        this.info.other_content_list.push(
          JSON.parse(JSON.stringify(this.webPageForm))
        );
        this.webPageDialogVisible = false;
      });
    },
    addWebPage() {
      this.addOtherContentVisible = false;
      this.webPageForm = { ...this.baseWebPageForm };
      this.$nextTick(() => {
        this.$refs.webPageForm.clearValidate();
      });
      this.webPageDialogVisible = true;
    },

    cancelAddPic() {
      this.picDialogVisible = false;
    },
    confirmAddPic() {
      this.$refs["picForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        // let i = parseInt(this.editableTabsValue);
        if (!this.info.other_content_list) {
          this.info.other_content_list = [];
        }
        this.info.other_content_list.push(
          JSON.parse(JSON.stringify(this.picForm))
        );
        this.picDialogVisible = false;
      });
    },
    addPic() {
      this.addOtherContentVisible = false;
      this.picForm = { ...this.basePicForm };
      this.picDialogVisible = true;
    },

    cancelAddVideo() {
      this.videoDialogVisible = false;
    },
    confirmAddVideo() {
      this.$refs["videoForm"].validate((valid) => {
        if (!valid) {
          return false;
        }
        // let i = parseInt(this.editableTabsValue);
        if (!this.info.other_content_list) {
          this.info.other_content_list = [];
        }
        this.info.other_content_list.push(
          JSON.parse(JSON.stringify(this.videoForm))
        );
        this.videoDialogVisible = false;
      });
    },
    addVideo() {
      this.addOtherContentVisible = false;
      this.videoForm = { ...this.baseVideoForm };
      this.videoDialogVisible = true;
    },
    // 表情包插入相关
    getPositionForTextArea,
    insertText(value, item) {
      let position = document.getElementById(`editContent`);
      let pos = this.getPositionForTextArea(position);
      let y = position.value;
      let frontString = y.substring(0, pos);
      let afterString = y.substring(pos, item.content.length);
      item.content = frontString + value + afterString;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        // 插入表情等表情/手势,聚焦;
        this.$nextTick(() => {
          position.focus();
          position.selectionStart = position.selectionEnd = pos + value.length;
        });
      }, 0);
    },
    addEmojiPopover(item) {
      let f = !item.emojiPopoverVisible;
      this.$set(this.info, "emojiPopoverVisible", f);
    },
    // 失焦调后台提示
    validTextEmojiContent(v, limitLen) {
      console.log("blur===", v);
      // 调后台接口
      let that = this;
      // Admin.api.ajax(
      //   {
      //     url: "/cw_message_group_send/get_content_length",
      //     async: true,
      //     type: "post",
      //     data: {
      //       content: v,
      //     },
      //   },
      //   function (ret, res) {
      // mock
      let res = {
        data: {
          length: 40,
        },
      };
      // if (res.code == 0) {
      let length = res.data.length;
      console.log("===", length, limitLen);
      if (length > limitLen) {
        that.curContentErr = true;
      } else {
        that.curContentErr = false;
      }
      // }
      // }
      // );
    },
    validateLimitByteLen(rule, value, callback, limitLen) {
      let len = this.getByteLen(value);
      if (len > limitLen) {
        callback(new Error("输入内容过长"));
      } else {
        callback();
      }
    },
    getByteLen,
    sopLoading() {
      this.otherContentLoading = this.$loading({
        lock: true,
        text: "上传中",
      });
    },
  },
  watch: {
    writeBackWelcome: {
      handler(n, o) {
        console.log("监听变化", n, this.writeBackWelcome);
        this.info = { ...this.writeBackWelcome };
      },
      immediate: true,
    },
  },
  created() {
    this.getMiniprogramList();
  },
};
</script>
<style>
@import url("./welcomeTextAndFile.css");
</style>