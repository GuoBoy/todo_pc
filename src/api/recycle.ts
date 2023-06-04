import { recoverType } from "@/hooks/recycle"
import { encryptInstance, instance } from "./request"

// 获取所有
export const apiGetRecycles = () => {
  return new Promise((resolve, reject) => {
    encryptInstance.get("recycle").then(resp => resolve(resp.data)).catch(e => reject(e))
  })
}

export const apiRecycleRecover = (id: number, tp: recoverType) => {
  return new Promise((resolve, reject) => {
    instance.put(`recycle/${id}?type=${tp}`).then(resp => resolve(resp.data)).catch(e => reject(e))
  })
}
