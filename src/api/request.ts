import { decryptResp } from "@/crypt"
import axios from "axios"
import { ElLoading, ElMessage } from 'element-plus'
import { useSettingStore } from "@/store"
import { useUserstore } from "@/store/user"

export const instance = axios.create()

instance.interceptors.request.use(config => {
  ElLoading.service()
  const settingStore = useSettingStore()
  const userStore = useUserstore()
  config.baseURL = settingStore.serverAddr
  config.headers ? config.headers['Authorization'] = userStore.token : ""
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

// 加密的请求实例
export const encryptInstance = axios.create()

encryptInstance.interceptors.request.use(config => {
  ElLoading.service()
  const settingStore = useSettingStore()
  const userStore = useUserstore()
  config.baseURL = settingStore.serverAddr
  config.headers ? config.headers['Authorization'] = userStore.token : ""
  return config
}, e => {
  ElLoading.service().close()
  ElMessage.error("请求失败~")
  return e
})

encryptInstance.interceptors.response.use(response => {
  ElLoading.service().close()
  var res = decryptResp(response.data)
  if (res instanceof Error) {
    ElMessage.error(res.message)
    return Promise.reject(response)
  }
  response.data = res
  return response
}, (e) => {
  ElLoading.service().close()
  ElMessage.error("请求失败~")
  return e
})
