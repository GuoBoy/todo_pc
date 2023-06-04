import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { ref } from "vue"
import router from "@/router"
import { useUserstore } from "./user"
import { useGroupItemStore } from "./groupItem"

// 设置store
export const useSettingStore = defineStore('setting', () => {
  const serverAddr = ref("http://127.0.0.1:8080")
  // 保存服务器地址
  const saveServerAddr = (addr: string) => {
    serverAddr.value = addr
    localStorage.setItem("server_addr", addr)
    ElMessage.success("修改成功")
  }
  // 全局搜索框
  const showSearch = ref(false)
  // 锁屏
  const locked = ref(false)
  const setLockState = (state: boolean) => locked.value = state
  // 锁屏时间，默认1分钟
  const lockTimelength = ref(1000 * 60)
  const setLockTimelength = (second: number) => {
    lockTimelength.value = second * 1000
    localStorage.setItem("lock-time-length", second.toString())
    ElMessage.success("保存成功")
  }
  return {
    serverAddr, saveServerAddr,
    showSearch,
    locked, setLockState, lockTimelength, setLockTimelength,
  }
})

// 初始化store
export const initStore = () => {
  // userinfo 加载用户信息
  const userStore = useUserstore()
  const ua = localStorage.getItem("username")
  const tk = localStorage.getItem("token")
  if ((ua ?? "") && (tk ?? "")) {
    userStore.saveLogin(ua as string, tk as string)
    // 加载最后更新时间
    // const ut = Number(localStorage.getItem("ut") ?? "1")
    // 保存item 和最后更新时间
    useGroupItemStore().init()
  }
  // setting
  const settingStore = useSettingStore()
  // 加载服务器地址
  const server_addr = localStorage.getItem("server_addr") ?? ""
  if (server_addr !== "") settingStore.saveServerAddr(server_addr)
  // 登录跳转
  userStore.authed ? router.push("/") : router.push("/login")
  // 锁屏时长
  const ltl = localStorage.getItem("lock-time-length") ?? "60"
  settingStore.setLockTimelength(parseInt(ltl))
}