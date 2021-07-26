<template>
  <div class="tag-in-table-cell table-row-tag-cell flex-row-between">
    <div
      :class="[
        isTagOver > 40
          ? 'table-row-tag-list-wrap table-row-tag-list-wrap-1-row'
          : 'table-row-tag-list-wrap',
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
          <div class="left tag-txt">{{ tag.group_name }}</div>
          <div class="right">
            <div class="right-txt tag-txt">
              {{ tag.tag_name }}
            </div>
          </div>
        </div>
      </template>
      <span v-else>--</span>
    </div>
    <el-popover
      v-if="isTagOver > 40"
      placement="bottom-end"
      trigger="hover"
      width="542"
    >
      <div class="table-row-tag-list-wrap table-row-tag-list-wrap-limit-height">
        <div
          v-for="(tag, index) in [...tagList]"
          :key="index"
          :class="[
            'table-row-tag-item',
            `table-row-tag-item-${tag.group_tag_type}`,
          ]"
        >
          <div class="left tag-txt">{{ tag.group_name }}</div>
          <div class="right">
            <div class="right-txt tag-txt">
              {{ tag.tag_name }}
            </div>
          </div>
        </div>
      </div>
      <div class="table-row-tag-more" slot="reference">
        <i class="el-icon-more" v-if="isTagOver > 40"></i>
      </div>
    </el-popover>
  </div>
</template>
<script>
module.exports = {
  name: "tag-in-table-cell",
  props: {
    tagList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      isTagOver: 0,
    };
  },
  watch: {
    tagList: {
      handler(n, o) {
        let tagsTxtLen = 0;
        // 每一个标签不为空，算字数 + 2 (即：标签字段间隔1个 + 标签间隔1个) 间距
        // 最后一个标签没有标签间隔 故 -1
        if (n && Array.isArray(n) && n.length) {
          n.map((tag) => {
            let tagItemTxtLen = tag.group_name.length + tag.tag_name.length;
            if (tagItemTxtLen) {
              tagsTxtLen = tagsTxtLen + tagItemTxtLen + 2;
            }
          });
          this.isTagOver = tagsTxtLen - 1;
        }
      },
      immediate: true,
    },
  },
};
</script>
<style scoped>
@import url("./tagInTableCell.css");
</style>


