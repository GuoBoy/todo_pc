<template>
  <el-scrollbar height="40vh" id="log" v-if="logs?.length !== 0">
    <div v-for="(item, index) in logs" :key="index" class="item">
      <div class="index">{{ index + 1 }}</div>
      <div class="info">{{ item }}</div>
    </div>
  </el-scrollbar>
  <el-button type="primary" class="btn" @click="$emit('clearLog')">清空</el-button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineEmits(['clearLog'])
defineProps({
  logs: Array
})
</script>

<style lang="scss" scoped>
#log {
  background-color: #000;
  color: #0e9c1f;
  height: auto;
}

.item {
  display: flex;

  .index {
    color: azure;
    width: 3vw;
    margin: 0 1vw;
  }
}

.btn {
  position: absolute;
  right: 3vw;
  transform: translateY(-6vh);
}
</style>
