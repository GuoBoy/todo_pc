<template>
  <h1>范围1</h1>
  <div class="parent p1">
    <div draggable="true" v-for="i in items1" :key="i">{{ i }}</div>
  </div>
  <h1>范围2</h1>
  <div class="parent p1">
    <p draggable="true" v-for="i in items2" :key="i">{{ i }}</p>
  </div>
  <div id="vditor"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const items1 = ref([1, 3, 4])
const items2 = ref([11, 13, 14])
const coverEl = ref<EventTarget>() // 要放置到的元素身上
onMounted(() => {
  const els = document.getElementsByClassName("p1") as HTMLCollectionOf<HTMLDivElement>
  // console.log(els);
  els[0].ondragover = function (e) {
    e.preventDefault()
    e.target ? coverEl.value = e.target : ""
  }
  els[0].ondragend = function (e) {
    console.log("拖拽结束", e.target, coverEl.value);
    const pos = Array.from(els[0].children).findIndex(v => v === coverEl.value)
    const newItem = Array.from(els[0].children)
    // newItem.splice(pos, 0,)
    Array.from(els[0].children).forEach((element, index, array) => {
      if (element === coverEl.value) { // 要放置的元素
        let idx = array.indexOf(e.target as Element)  // 选中的元素索引
        let itms = items1.value.splice(idx, 1)
        items1.value.splice(index, 0, itms[0])
        return
      }
    });
  }
})

// vditor
import Vditor from "vditor";
import "vditor/dist/index.css";
const contentEditor = ref<Vditor>();
onMounted(() => {
  contentEditor.value = new Vditor("vditor", {
    height: 360,
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    after: () => {
      contentEditor.value?.setValue("hello,Vditor+Vue!");
    },
  });
})
</script>

<style lang="scss" scoped>
.parent {
  width: 30%;
  height: 20%;
  border: 1px solid #000;

  div {
    margin: 5px;
    background: #409eff;
  }
}
</style>