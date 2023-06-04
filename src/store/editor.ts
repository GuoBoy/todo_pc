import { apiAddToDoItem, apiUpdateToDoItem, apiDelToDoItem } from "@/api"
import { encryptToForm } from "@/crypt"
import { LogType } from "@/model/system"
import { EditorItemModel, ToDoItemModel } from "@/model/todo_item"
import { ElMessage, ElMessageBox } from "element-plus"
import { defineStore } from "pinia"
import { ref, nextTick, reactive } from "vue"
import { useGroupItemStore } from "./groupItem"
import { useLogStore } from "./logs"

// editor store
export const useEditorStore = defineStore('editor', () => {
  //已打开的items
  const items = ref<EditorItemModel[]>([])
  const current = reactive({ id: -1, detail: "" })
  const groupItemStore = useGroupItemStore()

  const logStore = useLogStore()

  const setCurrent = (id: number, detail: string) => {
    nextTick(() => {
      current.id = id
      current.detail = detail
    })
  }

  const newItemCount = ref(0) // 新建item数量，方便分配id
  // 新建item
  const newItem = (gid: number) => {
    // 生成id
    const id = (newItemCount.value + 1) * -1
    newItemCount.value++
    // 插入新增的item
    items.value.unshift({
      data: { id: id, group_id: gid, checked: false, updated_at: "", detail: "", hashcode: "" }, editing: true, isNew: true, tempDetail: ""
    })
    current.id = id
    current.detail = ""
  }
  // 打开item，传入本地存储的item
  const openItem = (item: ToDoItemModel) => {
    // 查看是否存在,防止重复打开
    if (items.value.findIndex(({ data: { id } }) => id === item.id) !== -1) {
      // 切换为当前item
      if (item.id === current.id) return
      current.id = item.id
      current.detail = item.detail
      return
    }
    items.value.unshift({ data: item, editing: false, isNew: false, tempDetail: item.detail })
    current.id = item.id
    current.detail = item.detail
  }
  // 保存item
  const saveItem = () => {
    /**
     * 1. 获取当前item
     * 2. 如果是新建
     * 2. 如果是更新
     */
    const currentItem = items.value.find(({ data: { id } }) => id === current.id)
    if (currentItem === undefined) return
    const gid = currentItem.data.group_id
    // currentItem.data.detail = currentItem.tempDetail
    // 新增
    if (currentItem.isNew) {
      apiAddToDoItem(encryptToForm({ detail: current.detail, group_id: gid })).then((res: any) => {
        groupItemStore.addItems([{ id: res.id, hashcode: res.hashcode, updated_at: res.updated, detail: current.detail, checked: false, group_id: gid }], 0)
        Object.assign(currentItem, {
          data: {
            id: res.id, hashcode: res.hashcode, update_at: res.updated, detail: current.detail, group_id: gid, checked: false
          }, isNew: false, editing: false
        })
        // console.log(currentItem.data.id, currentItem.data.detail);
        setCurrent(currentItem.data.id, currentItem.data.detail)
        logStore.add("新增成功")
      })
    }
    else {      // 修改
      apiUpdateToDoItem(current.id, encryptToForm({ detail: current.detail, group_id: gid, hashcode: currentItem.data.hashcode })).then((res: any) => {
        groupItemStore.changeItem({ hashcode: res.hashcode, updated_at: res.updated, detail: current.detail, id: current.id, checked: false, group_id: gid })
        Object.assign(currentItem, { editing: false, data: { id: current.id, hashcode: res.hashcode, updated_at: res.updated, detail: current.detail, group_id: gid, checked: false } })
        logStore.add("保存成功")
      })
    }
  }
  // 删除item
  const delItem = (id: number) => {
    ElMessageBox.confirm(`确定要删除ID:${id}?`, '提示', { confirmButtonText: "确定", cancelButtonText: "我再想一想", type: 'warning' }).then(_ => {
      apiDelToDoItem(id).then((res: any) => {
        if (res.code !== 200) {
          logStore.add("删除失败", LogType.error)
          return
        }
        groupItemStore.delItem(id)
        // 从已打开删除
        if (items.value.length > 1) {
          const i = items.value.findIndex(v => v.data.id === id)
          const newCurrent = items.value[i === 0 ? i + 1 : i - 1]
          current.id = newCurrent.data.id
          current.detail = newCurrent.data.detail
          items.value.splice(i, 1)
        } else {
          items.value = []
        }
        logStore.add("删除成功")
      })
    }).catch(_ => {
      ElMessage.warning("取消删除")
    })
  }

  return {
    items, current, setCurrent,
    newItem, openItem, saveItem, delItem
  }
})

