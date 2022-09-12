<template>
  <div class="home-container">
    <div class="left">
      <div class="tools">
        <el-button type="primary" @click="onNewItem" size="small">新建</el-button>
        <el-button type="warning" @click="refreshItems" size="small">刷新</el-button>
      </div>
      <el-input placeholder="关键词搜索(目前不可用)" size="small" clearable @change="" disable></el-input>
      <div class="no-item" v-if="itemStore.items?.length===0">
        <span @click="onNewItem">还没有，点我新建~</span>
      </div>
      <div class="item" v-else v-for="item in itemStore.items" :key="item.id" @click="openItem(item)">
        <div class="content">
          {{item.detail}}
        </div>
        <div class="date">{{item.update}}</div>
        <el-button class="del-item" type="danger" size="small" @click="delItem(item.id)">删除</el-button>
      </div>
    </div>
    <div class="right" v-if="opendItems.length===0">
      <span>还没有打开打开的todo</span>
    </div>
    <div class="right" v-else>
      <ul>
        <li v-for="item in opendItems" :key="item.id" :class="[item.id===currentItemId?'currentIndex':'']"
          @click="onChangeCurrentItem(item)">
          <span>ID:{{item.id}}{{item.edited?"*":""}}</span>
          <span @click="closeItem(item)" class="close-item">X</span>
        </li>
      </ul>
      <textarea name="editor" id="editor" style="resize: none;" v-model="currentItemContetnt"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToDoItemModel, EditingTodoItemModel } from '@/model/todo_item';
import { useItemsStore, useUserstore } from '@/store';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref, watch } from 'vue';
import { apiAddToDoItem, apiCheckItemUpdate, apiDelToDoItem, apiGetAllToDoItems, apiUpdateToDoItem } from '../api'
const itemStore = useItemsStore()
const userStore = useUserstore()
const refreshItems = async () => {
  const result: any = await apiCheckItemUpdate()
  if (result.code === 302) {
    const res: any = await apiGetAllToDoItems()
    if (res.code === 200) {
      ElMessage.success("刷新成功")
      if (res.data.length !== 0) {
        itemStore.setItems(res.data, result['ltime'])
      }
      return
    }
    ElMessage.error("刷新失败")
    return
  }
  ElMessage.success("已是最新")
}

onMounted(() => {
  refreshItems()
  // 快捷键保存
  document.onkeydown = (ev) => {
    if (ev.ctrlKey && (ev.key === 's' || ev.key === 'S')) {
      const item = opendItems.value.find(v => v.id === currentItemId.value)
      if (item !== undefined) {
        saveItem(item)
      }
      ev.preventDefault()
    }
  }
})

const newItemCount = ref(0) // 新建item数量，方便分配id
// 新建item
const onNewItem = () => {
  const id = (newItemCount.value + 1) * -1
  newItemCount.value++
  opendItems.value.unshift({
    id: id, update: "", detail: "", hashcode: "", edited: true
  })
  currentItemId.value = id
  currentItemContetnt.value = ""
}
// 打开item
const openItem = (item: ToDoItemModel) => {
  currentItemId.value = item.id
  currentItemContetnt.value = item.detail
  // 查看是否存在,防止重复打开
  if (opendItems.value.findIndex(({ id }) => id === item.id) !== -1) return
  opendItems.value.unshift({ ...item, edited: false })
}
// 关闭item编辑
const closeItem = async (item: ToDoItemModel) => {
  for (var i = 0; i < opendItems.value.length; i++) {
    const current = opendItems.value[i]
    if (current.id === item.id) {
      if (current.edited && item.detail !== "") {
        try {
          if (await ElMessageBox.confirm(`ID:${item.id}还没有保存，是否要保存`, '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '不保存',
            type: 'warning',
          },)) {
            await saveItem(item)
          }
        } catch (error) {
        }
      }
      // 从已打开删除
      opendItems.value.splice(i, 1)
      const newCurrent = opendItems.value[i === 0 ? i : i - 1]
      if (opendItems.value.length === 0) return
      currentItemId.value = newCurrent.id
      currentItemContetnt.value = newCurrent.detail
    }
  }
}
// 删除item
const delItem = async (id: number) => {
  try {
    if (await ElMessageBox.confirm(`确定要删除ID:${id}?`, '提示', { confirmButtonText: "确定", cancelButtonText: "我再想一想", type: 'warning' })) {
      const res: any = await apiDelToDoItem(id)
      if (res.code !== 200) {
        ElMessage.error("删除失败")
        return
      }
      const index = itemStore.items.findIndex(v => v.id === id)
      itemStore.items.splice(index, 1)
      itemStore.storeItems()
      userStore.setLastUpdateTime(res['last_update_time'])
      ElMessage.success("删除成功")
    }
  } catch (error) {
  }
}
// 保存item
const saveItem = async (item: ToDoItemModel) => {
  // 新增
  if (item.id < 0) {
    const res: any = await apiAddToDoItem({ detail: item.detail })
    if (res['code'] !== 200) {
      ElMessage.error("新增失败,请重试~")
      return
    }
    for (let i = 0; i < opendItems.value.length; i++) {
      if (opendItems.value[i].id === item.id) {
        opendItems.value[i].id = res['id']
        opendItems.value[i].hashcode = res['hashcode']
        opendItems.value[i].update = res['update']
        opendItems.value[i].edited = false
        itemStore.items.unshift({ ...opendItems.value[i] })
        itemStore.storeItems()
        userStore.setLastUpdateTime(res['last_update_time'])
        ElMessage.success("保存成功")
        return
      }
    }
  } else {
    // 修改
    const res: any = await apiUpdateToDoItem(item.id, { detail: item.detail })
    if (res['code'] !== 200) {
      ElMessage.error("保存失败,请重试~")
      return
    }
    for (let i = 0; i < opendItems.value.length; i++) {
      if (opendItems.value[i].id === item.id) {
        opendItems.value[i].hashcode = res['hashcode']
        opendItems.value[i].update = res['update']
        opendItems.value[i].edited = false
        itemStore.items.forEach(v => {
          if (v.id === item.id) {
            const { edited, ...cv } = opendItems.value[i]
            Object.assign(v, cv)
          }
        })
        itemStore.storeItems()
        userStore.setLastUpdateTime(res['last_update_time'])
        ElMessage.success("保存成功")
        return
      }
    }
  }
}
// 已打开的item
const opendItems = ref<EditingTodoItemModel[]>([])
const currentItemId = ref(0)
const currentItemContetnt = ref('')
// 切换当前item
const onChangeCurrentItem = (item: EditingTodoItemModel) => {
  currentItemId.value = item.id
  currentItemContetnt.value = item.detail
}
// 监听输入变化
watch(currentItemContetnt, (v, o) => {
  opendItems.value.forEach((item => {
    if (item.id === currentItemId.value) {
      item.edited = true
      item.detail = v;
    }
  }))
})

</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  margin: 0 2px;

  .left {
    width: 20%;
    margin: 0 2px;
    border-right: 1px solid #9d989d;

    .tools {
      display: flex;
      padding: 5px;
      border-bottom: 3px solid #9d989d;

      .el-button {
        width: 100%;
      }
    }

    .no-item {
      margin: 30% 0 0 10%;
      cursor: pointer;
    }

    .item {
      border-bottom: 1px solid #9d989d;
      padding: 5px 0;
      cursor: pointer;

      .content {
        max-height: 10vh;
        overflow: hidden;
      }

      .date {
        font-size: small;
        padding-top: 2px;
      }

      .del-item {
        display: none;
        float: right;
        transform: translateY(-100%);
      }
    }

    .item:hover .del-item {
      display: inline;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    width: 80%;

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      height: auto;
      overflow: auto hidden;
      white-space: nowrap;
      cursor: pointer;

      li {
        display: inline-block;
        padding: 1px 2px;
        margin: .3px;
        background-color: #f2e9f2;

        span {
          padding: 0 2px;
        }

        .close-item {
          display: none;
        }
      }

      li:hover .close-item {
        display: inline;
      }

      .currentIndex {
        background-color: white;
      }

    }

    #editor {
      flex-grow: 1;
    }
  }
}

/* 美化 */
::-webkit-scrollbar {
  /* 滚动条宽 */
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  /* 滚动条 拖动条 */
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

::-webkit-scrollbar-track {
  /* 滚动条背景槽 */
  background-color: #eee;
  border-radius: 6px;
}
</style>