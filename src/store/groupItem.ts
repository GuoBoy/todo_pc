import { GroupModel } from "@/model/item_group"
import { ToDoItemModel } from "@/model/todo_item"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"
import { delAllData, getGroups, getItems, initItems, insertGroups, insertItems, removeItem, updateItem } from "./database"
import { useEditorStore } from "./editor"

// items groups
export const useGroupItemStore = defineStore('group-item', () => {

  const editorStore = useEditorStore()

  // 当前Group
  const currentGroup = ref<GroupModel>()
  const changeCurGroup = (id: number) => {
    currentGroup.value = groups.value.find(v => v.id === id)
  }
  watch(currentGroup, (v, _) => {
    loadItems()
  })
  // group
  const groups = ref<GroupModel[]>([])
  // 加载groups
  const loadGroups = () => {
    getGroups().then(res => groups.value = res)
  }

  const addGroups = async (gps: GroupModel[], ut: number) => {
    // 插入数据
    await insertGroups(gps)
    loadGroups()
  }

  // items
  const items = ref<ToDoItemModel[]>([])
  const currentItem = computed(() => items.value.filter(v => v.id === editorStore.current.id)[0] ?? null)
  // 加载items
  const loadItems = () => {
    getItems(currentGroup.value?.id as number).then(res => { res.sort((a, b) => a.updated_at < b.updated_at ? 1 : -1); items.value = res })
  }

  const addItems = async (itms: ToDoItemModel[], ut: number) => {
    // 插入数据
    await insertItems(itms)
    loadItems()
  }

  const delItem = async (id: number) => {
    await removeItem(id)
    loadItems()
  }

  const changeItem = async (item: ToDoItemModel) => {
    await updateItem(item)
    loadItems()
  }

  const setItems = async (gid: number, itms: ToDoItemModel[]) => {
    await initItems(itms, gid)
    loadItems()
  }

  const init = async () => {
    groups.value = (await getGroups())
    if (groups.value.length !== 0) {
      currentGroup.value = groups.value[0]
    }
  }
  // 清空所有
  const clearLocalStore = async () => {
    await delAllData()
    ElMessage.success("清空缓存成功")
    groups.value = []
    items.value = []
  }

  return {
    init,
    groups, loadGroups, addGroups,
    currentGroup, changeCurGroup,
    items, currentItem, loadItems, addItems, delItem, setItems, changeItem,
    clearLocalStore,
  }
})