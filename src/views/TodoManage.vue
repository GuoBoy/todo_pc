<template>
  <div class="todo-container">
    <Groups class="groups" />
    <el-icon @click="settingStore.showSearch = true" class="search-btn">
      <Search />全文搜索/Ctrl+F
    </el-icon>
    <Items class="items" />
    <Editor class="editor"></Editor>
  </div>
</template>

<script setup lang="ts">
import Editor from '@/components/Editor.vue';
import Groups from '@/components/Groups.vue';
import Items from "@/components/Items.vue"
import { useSettingStore } from '@/store';
import { Search } from "@element-plus/icons-vue"

const settingStore = useSettingStore()

</script>

<style scoped lang="scss">
.todo-container {
  height: 100%;
  overflow: auto;
  display: grid;
  gap: 2px;
  grid-template-columns: 200px 300px 1fr;
  grid-template-rows: auto 1fr;

  .groups {
    grid-area: 2 / 1;
  }

  //搜索框
  .search-btn {
    grid-area: 1 / 1 / 1 / 4;
    border: 1px solid #9d989d;
    border-radius: 8px;
    width: 90%;
    padding: 5px;
  }

  .items {
    grid-area: 2 / 2;
  }

  .editor {
    grid-area: 2 / 3;
  }
}
</style>