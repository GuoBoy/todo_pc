import { encryptInstance, instance } from "./request"


export const apiAddGroup = (name: string) => {
  return new Promise((resolve, reject) => {
    instance.post("group", { name: name }).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiDelGroup = (tid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`group/${tid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiForceDelGroup = (gid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`group/force/${gid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateGroup = (gid: number, name: string) => {
  return new Promise((resolve, reject) => {
    instance.post(`group/${gid}`, { name: name }).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

// 获取所有分组
export const apiGetAllGroups = () => {
  return new Promise((resolve, reject) => {
    encryptInstance.get("group").then(resp => resolve(resp.data)).catch(e => reject(e))
  })
}