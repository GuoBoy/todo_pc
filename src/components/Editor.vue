<template>
  <div class="editor-comp">
    <!-- 导航区 -->
    <ul class="nav-bar">
      <el-button size="small" @click="editorStore.newItem(groupItemStore.currentGroup?.id as number)" :icon="DocumentAdd"
        tips="新建todo"></el-button>
      <!-- item -->
      <li v-for="item in editorStore.items" :key="item.data.id"
        :class="[item.data.id === editorStore.current.id ? 'currentIndex' : '']">
        <!-- 显示内容或id -->
        <span @click="onChangeCurrentItem(item)" @auxclick="" class="nav-bar-item">{{
          item.data.detail !== "" ? item.data.detail.substring(0, 5) : 'ID:' + item.data.id }}{{ item.editing ? "*" : ""
  }}</span>
        <span @click="closeItem(item)" class="close-item">X</span>
      </li>
    </ul>
    <!-- 编辑区域 无打开 -->
    <div class="editor-view-no" v-if="editorStore.items.length === 0">
      <span>天行健，君子以自强不息</span>
    </div>
    <div class="editor-view" v-else>
      <div class="btns">
        <el-button size="small" :icon="InfoFilled" @click="showItemInfo = !showItemInfo"
          :tips="showItemInfo ? '隐藏信息' : '显示信息'" />
        <el-button size="small" :icon="Upload" @click="editorStore.saveItem" tips="保存修改" />
        <span style="margin: 0 4px; font-size: small;">共计{{ editorStore.current.detail.length }}字符</span>
      </div>
      <div class="item-info">
        <pre
          v-if="showItemInfo">{{ editorStore.items.filter(v => v?.data.id === editorStore.current?.id)[0]?.data }}</pre>
      </div>
      <textarea spellcheck="false" name="editor" id="editor" :disabled="editable"
        v-model="editorStore.current.detail"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EditorItemModel } from '@/model/todo_item';
import { useEditorStore } from '@/store/editor';
import { ElMessageBox } from 'element-plus';
import { Upload, DocumentAdd, InfoFilled } from "@element-plus/icons-vue"
import { computed, onMounted, ref, watch } from 'vue';
import { useGroupItemStore } from '@/store/groupItem';

const editorStore = useEditorStore()
const groupItemStore = useGroupItemStore()
// 切换当前item
const onChangeCurrentItem = (item: EditorItemModel) => {
  editorStore.setCurrent(item.data.id, item.tempDetail)
}
// 是否checked,以检查是否可编辑
const editable = computed(() => groupItemStore.items.find((v) => v.id === editorStore.current.id)?.checked)

// 关闭item编辑
const closeItem = (item: EditorItemModel) => {
  if (item.editing) {
    ElMessageBox.confirm(`ID:${item.data.id}还没有保存，是否要保存`, '提示', {
      confirmButtonText: '保存',
      cancelButtonText: '不保存',
      type: 'warning',
    },).then(_ => {
      editorStore.saveItem()
    }).catch(_ => { }).finally(() => {// 从已打开删除
      const i = editorStore.items.findIndex(v => v.data.id === item.data.id)
      editorStore.items.splice(i, 1)
      if (editorStore.items.length === 0) {
        editorStore.setCurrent(-1, "")
        return
      }
      onChangeCurrentItem(editorStore.items[i === 0 ? i : i - 1])
    })
  } else {
    const i = editorStore.items.findIndex(v => v.data.id === item.data.id)
    editorStore.items.splice(i, 1)
    if (editorStore.items.length === 0) {
      editorStore.setCurrent(-1, "")
      return
    }
    onChangeCurrentItem(editorStore.items[i === 0 ? i : i - 1])
  }
}

// 监听输入变化，修改编辑状态
watch(editorStore.current, (v, _) => {
  editorStore.items.map((item => {
    const { id, detail } = item.data
    if (id === editorStore.current.id && detail != v.detail) {
      item.editing = true
      item.tempDetail = v.detail;
    }
  }))
})

onMounted(() => {
  // 快捷键保存
  document.onkeydown = (ev) => {
    if (ev.ctrlKey && (ev.key === 's' || ev.key === 'S')) {
      editorStore.saveItem()
      ev.preventDefault()
    }
  }
})
// 是否显示item详细信息
const showItemInfo = ref(false)
</script>

<style scoped lang="scss">
// 组件整体
.editor-comp {
  display: grid;
  grid-template-rows: auto 1fr;
}

// item导航
.nav-bar {
  grid-row: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  height: auto;
  overflow: auto hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  // 标题
  li {
    display: inline-block;
    padding: 2px;
    margin: .3px;
    font-size: small;

    span {
      padding: 0 2px;
    }

    .close-item {
      display: none;
    }
  }

  // 导航显示关闭按钮
  li:hover .close-item {
    display: inline;
  }

  // 导航当前item样式
  .currentIndex {
    color: #409eff;
    background: rgb(241, 239, 239);
    padding: 0 10px;
  }
}

// 未打开编辑器
.editor-view-no {
  align-self: center;
  padding-bottom: 20vh;
  font-size: 30px;
  font-weight: bolder;
  text-align: center;
}

//编辑器
.editor-view {
  grid-row: 2;
  display: grid;
  grid-template-rows: auto auto 1fr;

  .item-info {
    font-size: small;
  }

  #editor {
    overflow-x: hidden;
    padding: 1vw;
    margin-right: 2px;
    font-size: large;
    border-color: #409eff;
    // 聚焦边框颜色
    outline-color: #ff4070;
    resize: none;
  }
}
</style>