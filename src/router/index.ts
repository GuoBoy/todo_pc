import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { useUserstore } from '@/store/user'
import Layout from '@/views/Layout.vue'
import { menus } from "@/hooks/menus"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: menus.map(v => {
      return {
        name: v.name,
        path: v.name,
        component: () => import(v.ComponentName ? `@/views/${v.ComponentName}.vue` : `@/views/${v.ComponentDir}/Index.vue`),
        meta: { requireAuth: true },
      }
    })
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login.vue"),
    meta: { requiresAuth: false }
  }, {
    path: "/register",
    component: () => import("@/views/register.vue"),
    meta: { requiresAuth: false }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const store = useUserstore()
  if (to.meta.requiresAuth && !store.authed && to.name !== "login") next({ name: "login" })
  else next()
})

export default router