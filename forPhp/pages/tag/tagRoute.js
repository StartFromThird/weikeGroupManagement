const Foo1 = { template: "<div>初始化页面</div>" };
const routes = [
  // { path: "/", component: Foo1 },
  // { path: "/bar", component: httpVueLoader("../../components/muban.vue") },
  {
    path: "/",
    component: httpVueLoader("./components/initPage/subjectInit.vue"),
  },
  {
    path: "/index",
    component: httpVueLoader("./components/initPage/subjectInit.vue"),
  },
  {
    path: "/subjectEdit",
    component: httpVueLoader("./components/initPage/subjectEdit.vue"),
  },
  {
    path: "/subjectAdd",
    component: httpVueLoader("./components/initPage/subjectEdit.vue"),
  },
  {
    path: "/subjectListDetail",
    component: httpVueLoader("./components/initPage/subjectListDetail.vue"),
  },
];
const router = new VueRouter({
  routes,
});

const originalReplace = router.prototype.replace;
router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
