<template>
  <div class="quadrant-container">
    <div class="header">
      <span>{{ title }}</span>
      <div class="right-btns">
        <el-icon @click="refreshItems">
          <Refresh></Refresh>
        </el-icon>
        <el-icon @click="dialogVisiable = true">
          <Plus></Plus>
        </el-icon>
      </div>
    </div>
    <div class="items">
      <div class="item" v-for="item in                        items                       " :key="item.detail">
        <div class="left-tag"></div>
        <div class="item-detail">{{ item.detail }}</div>
        <el-dropdown>
          <el-icon size="22">
            <More />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="showEditDialog = true; Object.assign(currentItem, item)"><el-icon>
                  <Edit></Edit>
                </el-icon>
              </el-dropdown-item>
              <el-dropdown-item @click=" delItem(item.id as number) "> <el-icon color="red">
                  <Delete></Delete>
                </el-icon> </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <el-dialog title="编辑todo" width="50%" v-model=" showEditDialog ">
    <el-input placeholder="输入todo" type="textarea" v-model=" currentItem.detail " style="margin: 10px;"></el-input>
    <span>
      <el-button size="small" @click=" showEditDialog = false ">取 消</el-button>
      <el-button size="small" type="primary" @click=" onChangeItem ">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="新建todo" width="50%" v-model=" dialogVisiable ">
    <el-input placeholder="输入todo" type="textarea" v-model=" detail " style="margin: 10px;"></el-input>
    <span>
      <el-button size="small" @click=" closeDialog ">取 消</el-button>
      <el-button size="small" type="primary" @click=" onAdd ">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { Plus, Delete, Refresh, More, Edit } from "@element-plus/icons-vue"
import { useLogStore } from '@/store/logs';
import { ElMessage } from 'element-plus';
import { LogType } from '@/model/system';
import { apiGetAllTtem, apiAddItem, apiDelItem, apiUpdateItem } from "./api"
import { insertQItems, getItemByQuadrant, deleteQItem, updateQitemDetail } from "@/store/database";

const logStore = useLogStore()

const props = withDefaults(defineProps<{
  color?: string,
  quadrant_type: number,
}>(), {
  color: "#f7f6ea",
})

const items = ref<QTodoModel[]>([])
// 象限名称
const title = computed(() => {
  switch (props.quadrant_type) {
    case 1:
      return "重要且紧急"
    case 2:
      return "重要不紧急"
    case 3:
      return "不重要不紧急"
    case 4:
      return "不重要紧急"
  }
})
// 添加d todo
const dialogVisiable = ref(false)
const detail = ref("")
const onAdd = () => {
  if (detail.value === "") {
    ElMessage.warning("请正确输入")
    return
  }
  // 发送请求
  apiAddItem(<QTodoModel>{ detail: detail.value, quadrant_type: props.quadrant_type }).then((res: any) => {
    const item = <QTodoModel>{ detail: detail.value, quadrant_type: props.quadrant_type, hashcode: res.hashcode, id: res.id, updated_at: res.updated }
    insertQItems(props.quadrant_type, [item], false).then(_ => loadItems())
    closeDialog()
    logStore.add("添加成功", LogType.success)
  })
}
//关闭添加对话框
const closeDialog = () => {
  dialogVisiable.value = false
  detail.value = ""
}
// 刷新items
const refreshItems = () => {
  apiGetAllTtem(props.quadrant_type).then((res: any) => {
    insertQItems(props.quadrant_type, res).then(_ => loadItems())
    logStore.add("刷新q items成功", LogType.success)
  })
}
// 删除item
const delItem = (id: number) => {
  apiDelItem(id).then((res: any) => {
    if (res.code !== 200) {
      logStore.add("删除q items失败", LogType.error)
      return
    }
    deleteQItem(id).then(val => {
      loadItems()
      logStore.add("删除q items成功", LogType.success)
    })
  })
}
// 本地加载items
const loadItems = () => {
  getItemByQuadrant(props.quadrant_type).then((res: any) => {
    items.value = res
  })
}
onMounted(() => {
  loadItems()
  // refreshItems()
})
const currentItem = reactive<QTodoModel>({ detail: '', quadrant_type: 0 })
const showEditDialog = ref(false)
const onChangeItem = () => {
  const { id, detail } = currentItem
  apiUpdateItem(id as number, detail).then((res: any) => {
    updateQitemDetail(id as number, res.hashcode, res.updated_at, detail)
    loadItems()
    showEditDialog.value = false
    logStore.add("修改成功", LogType.success)
  })
}
</script>

<style lang="scss" scoped>
.quadrant-container {
  overflow: auto;
  display: grid;
  grid-template-rows: auto 1fr;
  background: #efefef;
  margin: 2px;

  .header {
    margin-top: 5px;
    font-weight: bold;
    text-align: center;
    color: v-bind(color);

    .right-btns {
      float: right;
      margin-right: 20px;

      .el-icon {
        margin-right: 10px;
      }
    }
  }

  .items {
    height: 100%;
    overflow-y: auto;

    .item {
      display: grid;
      grid-template-columns: 2px 1fr 30px;
      box-shadow: 0 1px 1px 1px rgba(0, 0, 255, .2);
      margin: 5px;

      .left-tag {
        background: v-bind(color);
      }

      .item-detail {
        word-break: break-word;
        padding: 5px 10px;
      }
    }
  }
}
</style>