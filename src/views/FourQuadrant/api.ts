import { encryptInstance, instance } from "@/api/request"
import { encryptToForm } from "@/crypt"

// 添加q item
export const apiAddItem = (data: QTodoModel) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post("quadrant", encryptToForm(data)).then(res => resolve(res.data)).catch(e => reject(e))
  })
}
// 更新item
export const apiUpdateItem = (tid: number, detail: string) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post(`quadrant/${tid}`, encryptToForm({ detail: detail })).then(res => resolve(res.data)).catch(e => reject(e))
  })
}
// 删除q item
export const apiDelItem = (tid: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`quadrant/${tid}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

// 加载所有q item
export const apiGetAllTtem = (types: number) => {
  return new Promise((resolve, reject) => {
    encryptInstance.get(`quadrant/${types}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}