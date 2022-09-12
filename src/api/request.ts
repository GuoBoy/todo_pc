import axios from "axios"
import { ElLoading, ElMessage } from 'element-plus'
import { useSettingStore, useUserstore } from "../store"

export const instance = axios.create()

instance.interceptors.request.use(config => {
  ElLoading.service()
  const settingStore = useSettingStore()
  const userStore = useUserstore()
  config.baseURL = settingStore.serverAddr
  config.headers ? config.headers['Authorization'] = userStore.userInfo?.token ?? "" : ""
  return config
}, e => {
  ElLoading.service().close()
  ElMessage.error("请求失败~")
  return e
})

instance.interceptors.response.use(response => {
  ElLoading.service().close()
  return response
}, (e) => {
  ElLoading.service().close()
  ElMessage.error("请求失败~")
  return e
})
