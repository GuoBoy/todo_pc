import { instance } from "./request"

// 删除附件
export const apiDelAttachment = (filename: string) => {
  return new Promise((resolve, reject) => {
    instance.delete(`file/${filename}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiSendFeedback = (data: Object) => {
  return new Promise((resolve, reject) => {
    instance.post(`feedback`, data).then(res => resolve(res.data)).catch(e => reject(e))
  })
}