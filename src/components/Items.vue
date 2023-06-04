<template>
  <div class="items-manager">
    <div v-if="!items.length">
      <p style="cursor: pointer;text-align: center;"
        @click="editorStore.newItem(groupItemStore.currentGroup?.id as number)"
        v-if="groupItemStore.currentGroup !== undefined">啥也没有，点我新建！</p>
    </div>
    <!-- 列表 -->
    <div v-for="item in items" :key="item.id"
      :class='["item", editorStore.current.id === item.id ? "item-selected" : ""]'>
      <div class="funcs">
        <!-- <el-checkbox v-model="item.checked" ></el-checkbox> -->
        <div class="checkbox" @click="onChangeChecked(item)">
          <Select v-if="item.checked"></Select>
          <span v-else></span>
        </div>
        <div style="font-size: small;">{{ item.updated_at }}</div>
        <el-button class="del-item" type="danger" :icon="DeleteFilled" size="small"
          @click="editorStore.delItem(item.id)">{{ item.id }} </el-button>
      </div>
      <div :class="['item-item', item.checked ? 'deleted-line' : '']" @click="editorStore.openItem(item)">
        {{ item.detail }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/store/editor';
import { DeleteFilled, Select } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { ToDoItemModel } from '@/model/todo_item';
import { apiUpdateChecked } from '@/api';
import { useGroupItemStore } from '@/store/groupItem';
import { useLogStore } from '@/store/logs';
import { LogType } from '@/model/system';

const groupItemStore = useGroupItemStore()
const logStore = useLogStore()

const items = computed(() => groupItemStore.items)
// 更改item状态
const onChangeChecked = (item: ToDoItemModel) => {
  apiUpdateChecked(item.id, !item.checked).then((res: any) => {
    if (res.code !== 200) {
      logStore.add("关闭失败！", LogType.error)
      return
    }
    item.checked = !item.checked
    item.updated_at = res.data.updated
    groupItemStore.changeItem(item)
  })
}
// 编辑
const editorStore = useEditorStore()
</script>

<style lang="scss" scoped>
.items-manager {
  max-height: 100%;
  overflow-y: auto;

  .item {
    box-shadow: 0 2px 3px 1px rgba(0, 0, 255, .2);
    margin: 5px;
    padding: 10px;

    .item-item {
      max-height: 22vh;
      overflow: hidden;
      cursor: pointer;
    }

    .funcs {
      display: flex;
      justify-content: space-between;
      align-items: center;

      // 选择框
      .checkbox {
        border: 1px solid #6d7777;
        width: 15px;
        height: 15px;
      }

      .del-item {
        display: none;
      }
    }
  }

  .item:hover .del-item {
    display: block;
  }

  // 选中的item
  .item-selected {
    color: #409eff;
    background: rgba(210, 250, 250, .5);
  }
}

// 删除线
.deleted-line {
  text-decoration: line-through;
}
</style>