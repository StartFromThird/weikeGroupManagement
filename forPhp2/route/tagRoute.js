const routes = [
  {
    path: "/",
    component: httpVueLoader("../../views/tag/subjectInit.vue"),
  },
  {
    path: "/index",
    component: httpVueLoader("../../views/tag/subjectInit.vue"),
  },
  {
    path: "/subjectEdit",
    component: httpVueLoader("../../views/tag/subjectEdit.vue"),
  },
  {
    path: "/subjectAdd",
    component: httpVueLoader("../../views/tag/subjectEdit.vue"),
  },
  {
    path: "/subjectListDetail",
    component: httpVueLoader("../../views/tag/subjectListDetail.vue"),
  },
];
const router = new VueRouter({
  routes,
});
const originalReplace = router.prototype.replace;
router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};
