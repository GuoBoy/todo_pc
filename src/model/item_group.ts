import { ToDoItemModel } from "./todo_item"

export interface ItemGroup {
  id: number
  name: string
  items?: ToDoItemModel[]
}

export interface GroupModel {
  id: number
  name: string
  updated_at?: string
}