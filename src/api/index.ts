import { LoginForm } from '../model/user'
import { UploadItemModel } from '@/model/todo_item'
import { instance } from './request'
import { useUserstore } from '@/store'

export const apiLogin = (loginform: LoginForm) => {
  return new Promise((resolve, reject) => {
    instance.post("api/login", loginform).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiRegister = (loginform: LoginForm) => {
  return new Promise((resolve, reject) => {
    instance.post("api/register", loginform).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiAddToDoItem = (data: UploadItemModel) => {
  return new Promise((resolve, reject) => {
    instance.postForm("api/todo", data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiDelToDoItem = (tid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`api/todo/${tid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateToDoItem = (tid: number, data: UploadItemModel) => {
  return new Promise((resolve, reject) => {
    instance.postForm(`api/todo/${tid}`, data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiGetAllToDoItems = () => {
  return new Promise((resolve, reject) => {
    instance.get("api/todo").then(res => resolve(res.data)).catch(e => reject(e))
  })
}

// 检查是否需要更新
export const apiCheckItemUpdate = () => {
  const userStore = useUserstore()
  return new Promise((resolve, reject) => {
    instance.get(`api/todo/checkUpdate/${userStore.lastUpdateTime}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiTestServer = async (url: string) => {
  const { data } = await instance.get(url)
  if (data['code'] === 200) {
    return true
  }
  return false
}