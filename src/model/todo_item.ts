export interface ToDoItemModel {
  id: number
  group_id: number
  updated_at: string
  checked: boolean
  detail: string
  hashcode: string
}

export interface EditorItemModel {
  data: ToDoItemModel
  editing: boolean
  tempDetail: string
  isNew: boolean
}

export interface UploadItemModel {
  group_id: number
  detail: string
}