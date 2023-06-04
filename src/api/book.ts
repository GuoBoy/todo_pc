import { encryptToForm } from "@/crypt"
import { BookNote } from "@/model/book"
import { encryptInstance, instance } from "./request"

export const apiAddBooknote = (bk: BookNote) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post("book", encryptToForm(bk)).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiGetBooknotes = () => {
  return new Promise((resolve, reject) => {
    encryptInstance.get("book").then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiDelBooknoteByID = (id: number) => {
  return new Promise((resolve, reject) => {
    instance.delete(`book/${id}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateBookNameByID = (id: number, dt: string) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post(`book/${id}`, encryptToForm(dt)).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateBooknoteByID = (id: number, dt: string) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post(`book/note/${id}`, encryptToForm(dt)).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiUpdateBookSourceLinkByID = (id: number, dt: string) => {
  return new Promise((resolve, reject) => {
    encryptInstance.post(`book/sourcelink/${id}`, encryptToForm(dt)).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiAddBookAttachmentByID = (id: number, dt: FormData) => {
  return new Promise((resolve, reject) => {
    instance.post(`book/attachment/${id}`, dt).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export const apiDelBookAttachmentByFilename = (filename: string) => {
  return new Promise((resolve, reject) => {
    instance.delete(`book/attachment/${filename}`).then(res => resolve(res.data)).catch(e => reject(e))
  })
}
