<template>
  <div class="choose-customer" ref="chooseCustomer">
    <div class="left">
      <div class="left-head">
        <el-input
          v-model.trim="keyword"
          placeholder="请输入"
          clearable
          size="mini"
          @keyup.enter.native="searchByKey"
          @input="searchByKey"
          id="searchInput"
        ></el-input>
      </div>
      <div class="left-list">
        <div
          v-if="keyword"
          class="infinite-list-wrap"
          v-infinite-scroll="onLoad"
          :infinite-scroll-disabled="disabled"
          :infinite-scroll-distance="50"
        >
          <div
            v-for="(item, index) in listData"
            class="infinite-list-item"
            :key="item.id + index"
            @click="handleClickListItem(item)"
          >
            <el-avatar
              class="cus-avatar"
              shape="square"
              :size="24"
              :src="item.pic || defaultAvatar"
            >
              <img :src='defaultAvatar' />
            </el-avatar>
            <div class="m-l-8 overflow-ellipsis">{{ item.show }}</div>
          </div>
          <p class="list-tip" v-if="loading">加载中...</p>
          <p class="list-tip" v-if="noMore">没有更多了</p>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-head flex-row-between">
        <span>已选择 {{ selected.length }} 个客户</span>
        <el-button @click="clearAll" type="text" size="mini">清空已选</el-button>
      </div>
      <div class="right-list">
        <div class="right-selected-wrap">
          <div
            v-for="(item, index) in selected"
            class="selectd-list-item"
            :key="item.id + index"
          >
            <div class="selectd-list-item-left">
              <el-avatar
                class="cus-avatar"
                shape="square"
                :size="24"
                :src="item.pic || defaultAvatar"
              >
                <img :src='defaultAvatar' />
              </el-avatar>
              <div class="m-l-8 overflow-ellipsis">{{ item.show }}</div>
            </div>
            <div class="close" @click="handleClickDelItem(index)">×</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const defaultAvatar =
  'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
module.exports = {
  name: 'chooseCustomer',
  props: {
    subject: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultAvatar,
      // 左侧
      listData: [],
      keyword: '',
      pageSize: 30,
      pageNum: 1,
      totalNum: 0, 
      loading: false,
      noMore: false,
      param: {},
      // 右侧
      selected: [],
      selectedIds: []
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    this.$nextTick(() => {
      let inputS = this.$refs.chooseCustomer.querySelector('#searchInput')
      inputS.addEventListener('paste', this.getPaste)
    })
  },
  beforeDestroy() {
    let inputS = this.$refs.chooseCustomer.querySelector('#searchInput')
    if (inputS) {
      inputS.removeEventListener('resize', this.getPaste)
    }
  },
  mounted() {},
  watch: {},
  methods: {
    reset() {
      this.keyword = ''
      this.selected = []
      this.selectedIds = []
      this.pageNum = 1
      this.totalNum = 0 
    },
    getPaste(e) {
      let txt = e.clipboardData.getData('Text')
      txt = txt.replace(/^\s+|\s+$/g, '')
      // 谭佳豪;王丹如;王丹如;111;李👉 😈;  
      if (txt.includes(';')) {
        txt = txt + (txt[txt.length - 1] === ';' ? '' : ';')
        let defaultTxtArr = Array.from(new Set(txt.split(';')))
        let param = {
          search: txt,
          is_rep: '1',
          sub_id: this.subject,
        }
        setTimeout(() => {
          let res = {
            count: 111,
            list: [
              {
                id: '5fffeb25fabb1a000c419a64',
                show: '谭佳豪',
                pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
              },
              {
                id: '60827cda44c0e0000d9902d8',
                show: '李👉 😈',
                pic: 'http://wx.qlogo.cn/mmhead/qd3u5IHSYT8xtC5YgX0e9TVicia4pksQ05EeicOZm5kw4zgfHeKrFMDvA/0'
              }
            ]
          }
          if (res && res.list && res.list.length) {
            res.list.map((ele, i) => {
              let txtI = defaultTxtArr.indexOf(ele.show)
              if (txtI !== -1) {
                this.handleClickListItem(ele)
                defaultTxtArr.splice(txtI, 1)
              }
            })
          }
          this.keyword = defaultTxtArr.join(';')
          this.searchByKey()
        }, 300)
      }
    },
    searchByKey() {
      if (this.keyword == null) {
        return ;
      }
      this.$set(this.param, 'search', this.keyword)
      this.pageNum = 1
      this.totalNum = 0
      this.listData = []
      this.noMore = false
      this.loading = false
      this.getData()
    },
    onLoad() {
      this.getData()
    },
    getData() {
      let param = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        sub_id: this.subject,
        ...this.param
      }
      console.log('查询参数====', param)
      this.loading = true
      setTimeout(() => {
        this.loading = false
        // mock start
        let res = {
          count: 61,
          list: [
            {
              id: '5fffeb25fabb1a000c419a64',
              show: '11115fffeb25fabb1a000c419a6425fffeb25fabb1a000c419a642',
              pic: '',
              // 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '60827cda44c0e0000d9902c419a6425fffeb25fabb1a000c419a642d8',
              show: '222c419a6425fffeb25fabb1a000c419a642',
              pic: 'http://wx.qlogo.cn/mmhead/qd3u5IHSYT8xtC5YgX0e9TVicia4pksQ05EeicOZm5kw4zgfHeKrFMDvA/0'
            },
            {
              id: '5fffeb25fabb1a000c419a642',
              show: '333',
              pic: ''
            },
            {
              id: '60827cda44c0e0000d9902d82',
              show: '谭佳豪',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '5fffeb25fabb1a000c419a643',
              show: '王丹如',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '60827cda44c0e0000d9902d83',
              show: '王国壮',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '5fffeb25fabb1a000c419a6423',
              show: 'tidb实时的画像场景包a3',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '60827cda44c0e0000d9902d823',
              show: '人群包c003',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '5fffeb25fabb1a000c419a6424',
              show: 'tidb实时的画像场景包a4',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            },
            {
              id: '60827cda44c0e0000d9902d824',
              show: '人群包c004',
              pic: 'http://wx.qlogo.cn/mmhead/WAibKjHvK5nGLuMEpGtThbhZhHnDRyymeL8ibUd0KeCGE8FI7Wk78d5Q/0'
            }
          ]
        }
        let listData = [...res.list, ...res.list, ...res.list]
        if (this.pageNum === 3) {
          listData = [listData[0]]
        }
        listData = listData.map((ele, index) => {
          return {
            pic: ele.pic,
            id: ele.id + `${this.pageNum}-${index}`,
            show: `${this.pageNum}-${index}-${this.keyword}-` + ele.show
          }
        })
        // mock end
        this.totalNum = res.count
        this.listData = [...this.listData, ...listData]
        // mock end
        if (this.listData.length >= this.totalNum) {
          this.noMore = true
        } else {
          this.noMore = false
          this.pageNum++
        }
      }, 300)
    },
    handleClickListItem(item) {
      let id = item.id
      if (!this.selectedIds.includes(id)) {
        this.selected.push(item)
        this.selectedIds.push(item.id)
        this.$emit('updateselectd', this.selected)
      }
    },
    handleClickDelItem(i) {
      this.selected.splice(i, 1)
      this.selectedIds.splice(i, 1)
      this.$emit('updateselectd', this.selected)
    },
    clearAll() {
      this.selected = [];
      this.selectedIds = [];
      this.$emit('updateselectd', this.selected)
    },

  },
  components: {}
}
</script>

<style scoped>
@import url("../../../static/tag/chooseCustomer.css");
</style>