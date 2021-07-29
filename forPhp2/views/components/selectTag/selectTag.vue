<template>
  <div class="select-tag">
    <div class="select-tag-wrap">
      <el-cascader
        size="mini"
        clearable
        filterable
        ref="tagCas"
        placeholder="请选择企业标签"
        v-model="enterprise_label"
        :options="companyTags"
        :props="cascaderProps"
        @change="handleChangeTag"
        visiable="false"
        @expand-change="expandChange"
        :collapse-tags="isCollapseTags"
        :before-filter="beforeFilterEnterpriseLabel"
        @click.native.stop.prevent="handleClickCascader"
        style="width: 100%"
      >
      </el-cascader>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: "select-tag",
  props: {
    writeBackSelectedTag: {
      type: Array,
      default: function () {
        return [];
      },
    },
    maxTagNum: {
      type: Number,
      default: 10,
    }
  },
  data() {
    return {
      companyTags: [],
      cascaderProps: {
        multiple: true,
        checkStrictly: true,
        disabled: "cascaderPropsDisabled",
      },
      casLevel0KeyArr: [],
      enterprise_label: [],
      currentIndex: null,
      tags: [],
      showLen: 99,
    };
  },
  computed: {
    isCollapseTags() {
      let length = this.enterprise_label.length || 0;
      return length > this.collapseNum ? true : false;
    },
  },
  created() {
    // this.getSubOptions();
    this.getCompanyTag();
  },
  methods: {
    expandChange(valueList) {
      let companyTags = this.companyTags
      this.currentIndex = companyTags.findIndex((element) => {
        return element.value === valueList[0]
      })
      // 在展开时,绑定滚动事件;
      this.$nextTick(() => {
        this.secondElementScroll()
      })
    },
        loadMore(dom, lastScrollPosition) {
      console.log('currentIndex', this.currentIndex)
      let { companyTags, currentIndex } = this
      let { range, group_list, children } = this.companyTags[currentIndex]
      let totalLength = group_list.length
      if (range < totalLength) {
        let nextRange = parseInt(range) + this.limitLength
        let addChildren = group_list.slice(range, nextRange)
        this.companyTags[currentIndex].range = nextRange
        this.companyTags[currentIndex].children = [...children, ...addChildren]
        this.$nextTick(() => {
          if (dom && lastScrollPosition) {
            console.log('lastScrollPosition', lastScrollPosition)
            setTimeout(() => {
              dom.scrollTo(0, lastScrollPosition)
            }, 0)
          }
        })
      }
    },
    secondElementScroll() {
      let _this = this
      const Cascader_DOM = document.getElementsByClassName(
              'el-cascader-menu'
      )[1]
      console.log('Cascader_DOM', Cascader_DOM)
      if (Cascader_DOM) {
        const Cascader_DOM_warp = Cascader_DOM.getElementsByClassName(
                'el-cascader-menu__wrap'
        )[0]
        // 绑定滚动事件;
        Cascader_DOM_warp.addEventListener('scroll', function (event) {
          let { scrollTop, scrollHeight } = event.target
          let offsetHeight = Math.ceil(
                  event.target.getBoundingClientRect().height
          )
          let currentHeight = scrollTop + offsetHeight
          if (currentHeight >= scrollHeight) {
            // 节流;
            if (this.timer) {
              clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
              console.log('触底啦')
              _this.loadMore(Cascader_DOM_warp, scrollTop)
            }, 50)
          }
        })
      }
    },
    delTag(index) {
      this.tags.splice(index, 1);
      this.enterprise_label = this.tags.map((item) => {
        return [item.group_name, item.id];
      });
    },
    // 仅搜索企业标签
    beforeFilterEnterpriseLabel(name) {
      return new Promise((resolve, reject) => {
        let that = this;
        // Admin.api.ajax(
        //   {
        //     url: "/operation_search_get_label?type=HQ&name=" + name,
        //     loading: true,
        //     type: "get",
        //   },
        //   function (ret, res) {
          const res = {"code":200,"msg":"OK","time":1626702939,"data":[{"group_name":"【总标A】0623","group_list":[{"id":41185,"label_name":"总标A-0623_001","is_labeled":2}]}]};
            console.log(that.companyTags);
            that.lastCompanyTags = JSON.parse(JSON.stringify(that.companyTags));
            let filterArr = [];
            res.data.forEach((item) => {
              item.label = item.group_name;
              item.value = item.group_name;
              item.group_list.forEach((tagItem) => {
                tagItem.label = tagItem.label_name;
                tagItem.value = tagItem.id;
              });
              item.children = item.group_list;
              // 新查出来在哪个标签组
              // 标签组下children合并
              console.log("123", that.casLevel0KeyArr);
              let i = that.casLevel0KeyArr.indexOf(item.value);
              console.log(i);
              console.log("item====", item);
              if (i !== -1) {
                item.children.forEach((searchItem) => {
                  if (
                    JSON.stringify(that.companyTags[i].children).includes(
                      `${searchItem.label}`
                    )
                  ) {
                    console.log("已包含==========");
                  } else {
                    console.log("要push");
                    let arr = [...that.companyTags[i].children, searchItem];
                    that.companyTags[i].children = arr;
                  }
                  console.log("cookArr======", that.companyTags[i]);
                });
              }
              
            });
            console.log(that.companyTags);
            resolve(that.companyTags);
          }
        );
      // });
    },
    getCompanyTag() {
      let that = this;
      // Admin.api.ajax({
      //   url: '/operation_get_label?type=HQ',
      //   loading: true,
      //   type: 'get',
      // }, function (ret, res) {
      // mock start
      const data = [
        {
          group_name: "测试",
          group_tag_type: "HQ",
          group_list: [
            {
              id: 42591,
              is_labeled: 2,
              label_name: "sss",
              marketing_suggestions: 0,
            },
          ],
        },
        {
          group_name: "【总标A】0624",
          group_tag_type: "HQ",
          group_list: [
            {
              id: 41468,
              is_labeled: 2,
              label_name: "A",
              marketing_suggestions: 0,
            },
            {
              id: 42586,
              is_labeled: 2,
              label_name: "B",
              marketing_suggestions: 0,
            },
            {
              id: 42588,
              is_labeled: 2,
              label_name: "C",
              marketing_suggestions: 0,
            },
          ],
        },
      ];
      // mock end
      let level0KeyArr = [];
      let levelClassArr = [];

      data.forEach((item) => {
        item.cascaderPropsDisabled = true;
        item.label = item.group_name;
        item.value = item.group_name;
        item.tag_type = item.group_tag_type;
        item.range = 200;
        levelClassArr.push(item.group_name);
        item.group_list.forEach((item) => {
          item.label = item.label_name;
          item.value = item.id;
          item.tag_type = item.group_tag_type;
        });
        // item.children = item.group_list
        level0KeyArr.push(item);
        item.children = item.group_list.slice(0, 200);
        that.companyTags.push(item);
      });
      that.casLevel0KeyArr = levelClassArr;
      console.log(that.companyTags);
      // });
    },
    handleClickCascader(e) {
      let { target } = e;
      let i = parseInt(target.getAttribute("index"));
      console.log("index=====", target.getAttribute("index"));
      if (i === parseInt(i)) {
        this.delTag(i);
        let ar = [...this.tags];
        // let item = ar.splice(i, 1)[0];
        this.$nextTick(() => {
          this.tags = ar;
          this.handleChangeTag(this.tags);
          this.$refs.tagCas.dropDownVisible = false;
        });
      }
    },
    handleChangeTag(v) {
      let arr = this.$refs["tagCas"].getCheckedNodes();
      let arrays = [];
      arr.forEach((item) => {
        if (!item.hasChildren) {
          let length = item.data.length;

          let obj = {
            id: item.data.id,
            group_name: item.parent.data.group_name,
            tag_type: item.parent.data.group_tag_type,
            tag_name: item.data.label_name,
          };
          arrays.push(obj);
          console.log("cicle", this.tags);
        }
      });
      this.tags = arrays;
      let _this = this;
      let tagWrap = null;
      tagWrap = document.querySelector(".table-row-tag-list-wrap");
      const type = tagWrap ? "change" : "new";
      if (type === "new") {
        tagWrap = document.createElement("div");
        tagWrap.className = "table-row-tag-list-wrap table-row-tag-list-wrap-padding";
      }
      let h = "";
      let formator_arr = [...this.tags].slice(0, this.maxTagNum);
      console.log(formator_arr);
      const showLen = this.showLen;
      formator_arr.forEach((tag, index) => {
        if (index < showLen) {
        h += `<div class="table-row-tag-item table-row-tag-item-${tag.tag_type}">
                <div class="left tag-txt">${tag.group_name}</div>
                <div class="right">
                  <div class="right-txt tag-txt">${tag.tag_name}</div>
                  <div class="right-num right-close" index="${index}"><i class="el-icon-close" index="${index}"></i></div>
                </div>
              </div>`;
        } else if (index === showLen) {
          h += `<div class="table-row-over-show-len-tag">${showLen}+</div>`;
        }
      });
      tagWrap.innerHTML = h;
      if (type === "new") {
        let iD = document.querySelector(".el-cascader__search-input");
        document.querySelector(".el-cascader__tags").insertBefore(tagWrap, iD);
      }
    },
    writeBackTagView() {
      let tagWrap = null;
      tagWrap = document.querySelector(".table-row-tag-list-wrap");
      const type = tagWrap ? "change" : "new";
      if (type === "new") {
        tagWrap = document.createElement("div");
        tagWrap.className = "table-row-tag-list-wrap table-row-tag-list-wrap-padding";
      }
      let h = "";
      let formator_arr = [...this.tags].slice(0, this.maxTagNum);
      console.log(formator_arr);
      const showLen = this.showLen;
      formator_arr.forEach((tag, index) => {
        if (index < showLen) {
        let closeDom = document.createElement("div");
        h += `<div class="table-row-tag-item table-row-tag-item-${tag.tag_type}">
                <div class="left tag-txt">${tag.group_name}</div>
                <div class="right">
                  <div class="right-txt tag-txt">${tag.tag_name}</div>
                  <div class="right-num right-close" index="${index}"><i class="el-icon-close" index="${index}"></i></div>
                </div>
              </div>`;
        } else if (index === showLen) {
          h += `<div class="table-row-over-show-len-tag">${showLen}+</div>`;
        }
      });
      tagWrap.innerHTML = h;
      if (type === "new") {
        let iD = document.querySelector(".el-cascader__search-input");
        document.querySelector(".el-cascader__tags").insertBefore(tagWrap, iD);
      }
    }
  },
  watch: {
    enterprise_label: function (newVal, oldVAl) {
      if (newVal.length > this.maxTagNum) {
        this.$message({
          message: `最多只支持${this.maxTagNum}选择项`,
          duration: 1500,
          type: "warning",
        });
        this.$nextTick(() => {
          this.enterprise_label = oldVAl;
        });
      }
    },
    writeBackSelectedTag: {
      handler(n, o) {
        if (n) {
          this.tags = [...this.writeBackSelectedTag];
          this.enterprise_label = [...this.writeBackSelectedTag].map((ele) => {
            return [ele.group_name, ele.id]
          })
          this.$nextTick(() => {
            this.writeBackTagView();
          })
        } else {
          this.tags = [];
        }
      },
      immediate: true,
    }
  },
};
</script>
<style scoped>
/* @import url("./selectTag.css"); */
</style>
<style>
/* static/tag/tagItemList.css */
@import url("../../../static/tag/tagItemList.css");
.select-tag-wrap {
  position: relative;
}

.select-tag-wrap .el-cascader__tags .el-tag {
  display: none;
}

.select-tag-wrap .el-cascader__tags .right-close {
  background: none;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
}
.table-row-tag-item-HQ .right .right-num.right-close {
  background: none;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
}
.table-row-tag-item-SERVICE .right .right-num.right-close {
  background: none;
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
}
#tag-select {
  margin-top: 6px;
}
.table-row-over-show-len-tag {
  background-color: #909399;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
</style>
