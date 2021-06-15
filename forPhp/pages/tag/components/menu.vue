<template>
  <el-menu
    :default-active="active"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
  >
    <el-submenu v-for="item in menuData" :key="item.type" :index="item.type">
      <template slot="title">
        <div class="c-menu flex-between">
          <div class="c-menu-left">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
          <div class="c-menu-right" @click.stop.prevent="routeTo('/subjectAdd', 'add', item)">
            <i class="el-icon-circle-plus-outline"></i>
          </div>
        </div>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="menu in item.data" :index="menu.id" :key="menu.id">
          <div class="s-menu flex-between">
            <div class="s-menu-left">
              {{ menu.name }}
            </div>
            <div class="s-menu-right">
              <i @click.stop="routeTo('/subjectEdit', 'edit', menu)" class="el-icon-edit"></i>
            </div>
          </div>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
module.exports = {
  name: "menu",
  data() {
    return {
      menuData: [],
      active: '2'
    };
  },
  props: {},
  created() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      setTimeout(() => {
        let isSubjectExit = false;
        let menuData = [
          {
            type: "HUMAN",
            name: "人",
            icon: "el-icon-s-custom",
            data: [
              {
                id: 1,
                type: "HUMAN",
                name: "企微系统",
                icon: "xx",
              },
              {
                id: 2,
                type: "HUMAN",
                name: "业务系统",
                icon: "xx",
              },
            ],
          },
          {
            type: "GOOD",
            name: "货",
            icon: "el-icon-s-goods",
            data: [
              {
                id: 3,
                type: "GOOD",
                name: "货xx",
                icon: "xx",
              },
            ],
          },
          {
            type: "SCENE",
            name: "场",
            icon: "el-icon-s-home",
            data: [
              {
                id: 4,
                type: "SCENE",
                name: "场xx",
                icon: "xx",
              },
            ],
          },
        ];
        this.menuData = menuData;
        let len = menuData.length;
        if (len) {
          for (let i = 0; i < len; i++) {
            if (menuData[i].data && menuData[i].data.length) {
              isSubjectExit = true;
              break;
            }
          }
        }
      }, 500);
    },
    routeTo(path, type, menu) {
      this.active = menu.id;
      let query = {
        pageType: type,
        type: menu.type
      }
      if (menu.id) {
        query.id = menu.id
      }
      this.$router.push({
        path,
        query
      })
    },
    handleOpen(key, keyPath) {
      console.log("open=======",key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("close=======", key, keyPath);
    },
    handleSelect(i, ids) {
      let id = ids[1]
      this.$router.push({
        path: '/subjectListDetail',
        query: {
          id
        }
      })
    },
  },
};
</script>
<style scoped>
.flex-between {
  display: flex;
  justify-content: space-between;
}
.c-menu {
  padding-right: 10px;
}
.s-menu {
  margin-right: -15px;
}
</style>