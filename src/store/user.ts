import router from "@/router"
import { defineStore } from "pinia"
import { ref } from "vue"

// 用户信息store
// 使用localStorage保存
export const useUserstore = defineStore("user", () => {
  const username = ref("")
  const token = ref("")
  const authed = ref(false)
  // 登录
  const saveLogin = (ua: string, tk: string) => {
    username.value = ua;
    token.value = tk
    authed.value = true
    localStorage.setItem('username', ua)
    localStorage.setItem('token', tk)
    router.push("/")
  }
  // 退出登录
  const saveLoginout = () => {
    authed.value = false
    localStorage.clear()
    router.push("/login")
  }
  // 保存最后更新时间
  const UpdateTime = ref(1)
  const saveUpdateTime = (ut: number) => {
    UpdateTime.value = ut;
    localStorage.setItem('ut', ut.toString())
  }

  return {
    username, token, authed,
    saveLogin, saveLoginout,
    UpdateTime, saveUpdateTime
  }
})