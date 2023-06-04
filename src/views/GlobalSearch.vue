<template>
  <div class="bg" v-if="isShow">
    <!-- 关闭按钮 -->
    <el-icon size="36" style="float: right;color: white;" id="close-btn" @click='emit("update:isShow", false)'>
      <Close></Close>
    </el-icon>
    <!-- 搜索主体 -->
    <div class="container">
      <el-input class="input-box" v-model="searchKey" placeholder="输入关键词搜索当前分组" clearable></el-input>
      <!-- 结果列表 -->
      <div class="result">
        <div class="item" v-for="item in results" :key="item.id" @click="onClick(item)">
          <p style="font-size: larger;">{{ item.detail }} </p>
          <p style="font-size: small;"> {{ item.updated_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ToDoItemModel } from '@/model/todo_item';
import { useEditorStore } from '@/store/editor';
import { searchItem } from "@/store/database"
import { Close } from "@element-plus/icons-vue"

defineProps<{
  isShow: boolean
}>()
const emit = defineEmits(['update:isShow'])

const results = ref<ToDoItemModel[]>([])
const searchKey = ref("")
watch(searchKey, (v, _) => {
  results.value = []
  v !== "" ? searchItem(v).then(res => results.value = res) : ""
})
// 选中打开
const editorStore = useEditorStore()
const onClick = (itm: ToDoItemModel) => {
  editorStore.openItem(itm)
  emit("update:isShow", false)
}
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000, $alpha: .5);
  z-index: 1;
}

.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 66%;
  height: 80%;
  background: #fff;
  display: grid;
  grid-template-rows: auto 1fr;

  .input-box {
    width: auto;
    margin: 10px;
  }

  .result {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;

    .item {
      background-color: #d2fafa;
      width: 90%;
      padding: 0 10px;
      margin: 5px 0;
      cursor: pointer;
    }
  }
}
</style>
