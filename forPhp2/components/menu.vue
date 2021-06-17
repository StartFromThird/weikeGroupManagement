<template>
  <el-menu
    :default-active="active"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    ref="tagMenu"
  >
    <el-submenu
      v-for="item in menuData"
      :key="item.type"
      :index="`${item.type}`"
    >
      <template slot="title">
        <div
          :class="[
            'c-menu flex-between',
            item.type === activeC ? 'c-menu-active' : '',
          ]"
        >
          <div class="c-menu-left">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </div>
          <div
            class="c-menu-right"
            @click.stop.prevent="routeTo('/subjectAdd', 'add', item)"
          >
            <i class="el-icon-circle-plus-outline"></i>
          </div>
        </div>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="menu in item.data"
          :index="`${menu.id}`"
          :key="menu.id"
        >
          <div class="s-menu flex-between">
            <div class="s-menu-left">
              {{ (menu.name.length > 9 ? menu.name.slice(0, 8) + '...' : menu.name) || '-' }}
            </div>
            <div class="s-menu-right">
              <i
                @click.stop="routeTo('/subjectEdit', 'edit', menu)"
                class="el-icon-edit"
              ></i>
            </div>
          </div>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
module.exports = {
  name: "main-menu",
  data() {
    return {
      menuData: [],
      active: null,
      activeC: "",
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
        let defaultSubject = {};
        let menuData = [
          {
            type: "HUMAN",
            name: "人",
            icon: "el-icon-s-custom",
            data: [
              {
                id: 1,
                type: "HUMAN",
                name: "企微系统企微系统企微系统",
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
        this.$nextTick(() => {
          if (
            this.$route.query &&
            this.$route.query.id &&
            this.$route.query.type
          ) {
            this.active = `${this.$route.query.id}`;
            this.activeC = `${this.$route.query.type}`;
          } else if (
            this.$route.query &&
            this.$route.query.pageType === "add"
          ) {
            this.activeC = `${this.$route.query.type}`;
          } else {
            let len = menuData.length;
            if (len) {
              for (let i = 0; i < len; i++) {
                if (menuData[i].data && menuData[i].data.length) {
                  isSubjectExit = true;
                  this.active = `${menuData[i].data[0].id}`;
                  defaultSubject = menuData[i].data[0];
                  defaultSubject.path = '/subjectListDetail'
                  break;
                }
              }
            }
            console.log("是否有默认====", isSubjectExit);
            if (isSubjectExit) {
              this.$store.commit("setSubjectExit", defaultSubject);
            } else {
              this.$store.commit("setSubjectExit", false);
            }
          }
        });
      }, 500);
    },
    routeTo(path, type, menu) {
      // this.active = `${menu.id}`;
      // this.activeC = menu.type;
      let query = {
        pageType: type,
        type: menu.type,
      };
      if (menu.id) {
        query.id = menu.id;
      }
      this.$router.push({
        path,
        query,
      });
    },
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {},
    handleSelect(i, ids) {
      let id = ids[1];
      let type = ids[0];
      this.active = `${id}`;
      this.activeC = type;
      this.$router.push({
        path: "/subjectListDetail",
        query: {
          id,
          type,
        },
      });
    },
  },
  watch: {
    $route(to, from) {
      if (to.query) {
        this.active = `${to.query.id}` || null;
        this.activeC = to.query.type;
      }
    },
  },
};
</script>
<style>
/* .el-menu-item {
  padding: 20px;
} */
</style>
<style scoped>
.flex-between {
  display: flex;
  justify-content: space-between;
}
.c-menu {
  padding-right: 10px;
}
.c-menu-active .c-menu-left,
.c-menu-active .c-menu-left i {
  color: #1773fa;
}
.s-menu {
  margin-right: -15px;
  /* margin-left: -15px; */
}
</style>