import { createWebHistory, createRouter } from "vue-router";
import G_index1 from '@/components/G_index1.vue'





const routes = [
  {
    path: "/",
    component: G_index1,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  // console.log("router beforeEach")
  // const _appState = appState()
  // _appState.pathname.value = to.fullPath
  
  
  
  next()
})
export default router;