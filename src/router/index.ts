import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Layout from "../layout/index.vue"
import { useUserstore } from '../store'
import Home from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    // children: Menus.map(item => {
    //   return { path: item.path, component: () => import(item.componentPath) }
    // })
    children: [
      {
        path: "",
        component: Home,
      }, {
        path: "/setting",
        component: () => import("@/views/Setting.vue"),
      }
    ]
  }
  , {
    name: "login",
    path: "/login",
    component: () => import("../views/login.vue"),
    meta: { requiresAuth: false }
  }, {
    path: "/register",
    component: () => import("../views/register.vue"),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const store = useUserstore()
  if (to.meta.requiresAuth && !store.logined && to.name !== "login") next({ name: "login" })
  else next()
})

export default router