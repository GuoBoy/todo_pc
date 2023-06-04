import { LoginForm } from '../model/user'
import { encryptInstance, instance } from './request'
import { useUserstore } from '@/store/user'
import { CryptedDataModel } from '@/model/crypt'

// 用户登录验证
export const verifyUser = () => {
  return new Promise((resolve, reject) => {
    instance.get("/verify").then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiLogin = (loginform: LoginForm) => {
  return new Promise((resolve, reject) => {
    instance.post("login", loginform).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiRegister = (loginform: LoginForm) => {
  return new Promise((resolve, reject) => {
    instance.post("register", loginform).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiChangePassword = (data: CryptedDataModel) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post("changepwd", data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiAddToDoItem = (data: CryptedDataModel) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post("todo", data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiDelToDoItem = (tid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`todo/${tid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiForceDelToDoItem = (tid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`todo/force/${tid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateToDoItem = (tid: number, data: CryptedDataModel) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post(`todo/${tid}`, data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateChecked = (tid: number, state: boolean) => {
  return new Promise((resolve, reject) => {
    instance.post(`todo/${tid}/${state}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

// 获取所有
export const apiGetAllToDoItems = (gid: number) => {
  return new Promise((resolve, reject) => {
    encryptInstance.get(`todo/${gid}`).then(resp => resolve(resp.data)).catch(e => reject(e))
  })
}

// 检查是否需要更新
export const apiCheckItemUpdate = () => {
  const userStore = useUserstore()
  return new Promise((resolve, reject) => {
    instance.get(`todo/checkUpdate/${userStore.UpdateTime}`).then((res) => resolve(res.data)).catch(e => reject(e))
  })
}
// 获取最新版本
export const apiGetLatestVersion = () => {
  return new Promise((resolve, reject) => {
    instance.get(`version/pc`).then((res) => resolve(res.data)).catch(e => reject(e))
  })
}
//测试服务状态
export const apiTestServer = async (url: string) => {
  const { data } = await instance.get(url)
  if (data['code'] === 200) {
    return true
  }
  return false
}