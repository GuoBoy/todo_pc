<template>
  <div class="about">
    <div class="desc">
      <h1>关于 ToDo@{{ Verison }}<el-button style="margin-left: 10px;" type="primary" size="small"
          @click="checkAppUpdate(false)">检查更新</el-button> </h1>
      <p>ToDo 由小人物自主开发，主要自用</p>
    </div>
    <h3>ChangeLog</h3>
    <div class="change-log">
      <pre>{{ changelog }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Verison } from "@/hooks/version"
import { checkAppUpdate } from "@/hooks/update"
import changelog from "@/assets/CHANGELOG";
</script>

<style scoped lang="scss">
.about {
  .desc {
    text-align: center;
  }

  .change-log {
    height: 30vh;
    overflow-y: auto;
    padding-left: 20px;
  }
}
</style>