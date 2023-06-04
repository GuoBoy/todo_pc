<template>
  <div class="lockscreen">
    <pre class="item">{{ itemStore.currentItem?.detail ?? saying }}</pre>
    <!-- 上滑按钮 -->
    <el-icon id="unlock-btn" size="35" tips="点击解锁" @click="settingStore.setLockState(false)">
      <Unlock />
    </el-icon>
  </div>
</template>
  
<script lang="ts" setup>
import { useSettingStore } from "@/store";
import { useGroupItemStore } from "@/store/groupItem";
import { Unlock } from "@element-plus/icons-vue"
import { onMounted, ref } from "vue";

const settingStore = useSettingStore()
const itemStore = useGroupItemStore()
const saying = ref("我是猪，一只大笨猪~")
onMounted(() => {
  const cibaApi = "https://v1.jinrishici.com/all.json"
  fetch(cibaApi).then(async res => {
    const dt = await res.json()
    saying.value = `${dt.content}\n\n《${dt.origin}》——${dt.author}`
  })
})
</script>
  
<style lang='scss' scoped>
// 主体
.lockscreen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  background: #9ecaf5;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  // item内容
  .item {
    padding: 0 5vw;
    width: 100%;
    height: 80%;
    overflow: auto;
  }
}

// 解锁按钮
#unlock-btn {
  position: absolute;
  bottom: 10vh;
  right: 50%;
}
</style>
  