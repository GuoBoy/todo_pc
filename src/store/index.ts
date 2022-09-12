import { defineStore } from "pinia"
import { ToDoItemModel } from "src/model/todo_item"
import { UserInfoModel } from "src/model/user"
import { ref, watch } from "vue"

export const useUserstore = defineStore("user", () => {

  const userInfo = ref<UserInfoModel>()
  const logined = ref(false)
  const lastUpdateTime = ref(1)

  const setLastUpdateTime = (lt: number) => {
    lastUpdateTime.value = lt;
    localStorage.setItem('lt', lt.toString())
  }

  const setLogin = (userinfo: UserInfoModel, lt: number) => {
    userInfo.value = userinfo
    logined.value = true
    localStorage.setItem('userinfo', JSON.stringify(userinfo))
    setLastUpdateTime(lt)
  }
  const setLoginOut = () => {
    userInfo.value = {
      username: "",
      password: "",
      token: ""
    }
    logined.value = false
    localStorage.removeItem("userinfo")
    localStorage.removeItem("lt")
    localStorage.removeItem('items')
  }

  return {
    userInfo, logined, lastUpdateTime, setLogin, setLoginOut, setLastUpdateTime
  }
})

export const useItemsStore = defineStore('items', () => {
  const items = ref<ToDoItemModel[]>([])
  const userStore = useUserstore()
  const setItems = (itms: ToDoItemModel[], lt?: number) => {
    items.value = itms
    storeItems()
    if (lt !== undefined) userStore.setLastUpdateTime(lt)
  }

  const storeItems = () => {
    localStorage.setItem('items', JSON.stringify(items.value))
  }

  return {
    items, setItems, storeItems
  }
})

export const useSettingStore = defineStore('setting', () => {
  const serverAddr = ref("http://127.0.0.1")

  const setServerAddr = (addr: string) => {
    serverAddr.value = addr
    localStorage.setItem("server_addr", addr)
  }

  const title = ref("ToDo")

  const setTitle = (ti: string) => {
    title.value = ti
  }

  return {
    serverAddr,
    setServerAddr,
    title, setTitle
  }

})


export const initStore = () => {
  // userinfo
  const userStore = useUserstore()
  const userinfo: UserInfoModel = JSON.parse(localStorage.getItem("userinfo") ?? String(<UserInfoModel>{}))
  const lt = localStorage.getItem("lt") ?? "1"
  if (userinfo.token !== "") {
    userStore.setLogin(userinfo, Number(lt))
  }
  // setting
  const settingStore = useSettingStore()
  const server_addr = localStorage.getItem("server_addr") ?? ""
  if (server_addr !== "") settingStore.setServerAddr(server_addr)
  // items
  const itemsStore = useItemsStore()
  const items: ToDoItemModel[] = JSON.parse(localStorage.getItem('items') ?? String(<ToDoItemModel[]>[]))
  if (items.length !== 0) itemsStore.setItems(items)
}