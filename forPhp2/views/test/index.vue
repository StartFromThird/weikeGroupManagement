<template>
  <div>
    <h2>渠道活码拖拽</h2>
    <div class="menu-content"></div>
    <h2>drag-content1</h2>
    <div class="t1" id="drag-content1">
      <!-- <draggable element="ul" :list="tableData" @end="myend" group="site">
        <transition-group
          type="transition"
        
        >
          <el-tree
            node-key="id"
            :data="treeData"
            default-expand-all
            @node-click="handleTreeNodeClick"
          >
          </el-tree>
        </transition-group>
      </draggable> -->
      <!-- <draggable element="ul" :list="listData" @end="myend">
        <transition-group type="transition"> -->
      <!-- <li v-for="(item) in listData" :key="item.id" style="height: 40px;border-bottom: 1px solid #f00;width: 200px;">
            {{ item.name }}
          </li> -->
      <draggable element="ul" :list="tableData" @end="myend" group="site">
        <transition-group type="transition">
          <el-tree
          key="11111"
            node-key="id"
            :data="treeData"
            default-expand-all
            @node-click="handleTreeNodeClick"
            @drop.native="test"
            @dragenter.native.prevent
            @dragover.native.prevent
          >
          </el-tree>
        </transition-group>
      </draggable>
      <el-table :data="tableData" row-key="id">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div>
      <!-- <draggable element="ul" :list="listData" @end="myend">
        <transition-group type="transition">
          <li v-for="(item) in listData" :key="item.id">
            {{ item.name }}
          </li>
        </transition-group>
      </draggable> -->
    </div>
    <!-- <div class="t1" id="drag-content">
      <div class="left">
        <el-tree
          :data="treeData"
          default-expand-all
          @node-click="handleTreeNodeClick"
        >
        </el-tree>
      </div>
      <div class="right">
        <el-table :data="tableData" current-row-key="id">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </div>
    </div> -->
  </div>
</template>
<script>
module.exports = {
  name: "test",
  data() {
    return {
      treeData: [],
      tableData: [],
      myArray: [
        { people: "cn", id: 1, name: "www.itxst.com" },
        { people: "cn", id: 2, name: "www.baidu.com" },
        { people: "cn", id: 3, name: "www.taobao.com" },
        { people: "us", id: 4, name: "www.google.com" },
      ],
      listData: [
        {
          id: "001",
          date: "2016-05-02",
          name: "文件夹1",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: "002",
          date: "2016-05-02",
          name: "文件夹2",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
  created() {
    this.getBaseData();
  },
  mounted() {
    this.drag();
    // document.body.ondrop = function (event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // };
    // this.rowDrop();
  },
  updated() {
    console.log(this.tableData);
  },
  methods: {
    test(e) {
      debugger;
    },
    // tree drag
    allowDrop(draggingNode, dropNode, type) {
      debugger;
      console.log(
        "drog====",
        draggingNode,
        "dropNode====",
        dropNode,
        "type====",
        type
      );
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    },

    onStart() {},
    onEnd() {},
    myend() {
      debugger
      console.log("td===", this.tableData);
      console.log("ld===", this.listData);
    },
    drag() {
      const el = document.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      Sortable.create(el, {
        group: "site",
        disabled: false, // 拖拽不可用? false 启用
        ghostClass: "sortable-ghost", //拖拽样式
        animation: 150, // 拖拽延时，效果更好看
        onEnd: (e) => {
          console.log("drag===", e);
          // 拖拽结束时的触发
          let arr = this.tableData; // 获取表数据
          arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]); // 数据处理，获取最新的表格数据
          this.$nextTick(function () {
            this.tableData = arr;
            console.log(this.tableData);
          });
        },
      });
    },
    // rowDrop() {
    //   const tbody = document.querySelector("#drag-content");
    //   const _this = this;
    //   Sortable.create(tbody, {
    //     onEnd({ newIndex, oldIndex }) {
    //       const currRow = _this.tableData.splice(oldIndex, 1)[0];
    //       _this.tableData.splice(newIndex, 0, currRow);
    //     },
    //   });
    // },
    getBaseData() {
      this.tableData = [
        {
          id: "111",
          date: "2016-05-02",
          name: "王小虎1",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: "1112",
          date: "2016-05-04",
          name: "王小虎2",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          id: "1113",
          date: "2016-05-01",
          name: "王小虎3",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          id: "1114",
          date: "2016-05-03",
          name: "王小虎4",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ];
      this.treeData = [
        {
          label: "一级 1",
          id: "0001",
          children: [
            {
              label: "二级 1-1",
              id: "0002",
              children: [
                {
                  id: "0003",
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          id: "0004",
          children: [
            {
              label: "二级 2-1",
              id: "0005",
              children: [
                {
                  label: "三级 2-1-1",
                  id: "0006",
                },
              ],
            },
            {
              label: "二级 2-2",
              id: "0007",
              children: [
                {
                  label: "三级 2-2-1",
                  id: "0008",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          id: "0009",
          children: [
            {
              label: "二级 3-1",
              id: "0010",
              children: [
                {
                  label: "三级 3-1-1",
                  id: "0011",
                },
              ],
            },
            {
              label: "二级 3-2",
              id: "0012",
              children: [
                {
                  label: "三级 3-2-1",
                  id: "0013",
                },
              ],
            },
          ],
        },
      ];
    },
    handleTreeNodeClick() {
      console.log("treeClick===", ...arguments);
    },
  },
};
</script>
<style scoped>
.t1 {
  display: flex;
  width: 100vw;
}
.left {
  min-width: 200px;
}
.right {
  flex: 1;
}
</style>
