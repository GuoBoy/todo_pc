<script setup lang="ts">
import zhCn from 'element-plus';
import { onMounted, ref } from 'vue';
import { verifyUser } from './api';
import { checkAppUpdate } from './hooks/update';
import { initStore, useSettingStore } from './store';
import { initDB } from './store/database';
import { useUserstore } from './store/user';
import GlobalSearch from './views/GlobalSearch.vue';
import LockScreen from './views/LockScreen.vue';
import { useRouter } from 'vue-router';

const settingStore = useSettingStore()
const router = useRouter()

// 计时器
const timer = ref()
const initTimer = () => {
  clearInterval(timer.value)
  timer.value = setInterval(() => {
    const cur = router.currentRoute.value.name
    if (!cur || cur === "four-quadrant") return
    settingStore.setLockState(true)
  }, settingStore.lockTimelength)
}

onMounted(async () => {
  await initDB()
  initStore()
  // 登录验证,验证失败退出登录
  const res = <{ code: number } | undefined>await verifyUser()
  if (!res || res.code !== 200) useUserstore().saveLoginout()
  // 检查更新
  checkAppUpdate(true)
  // 搜索快捷键
  window.onkeydown = (ev) => {
    // 清除timer
    initTimer()
    if (ev.ctrlKey && (ev.key === 'f' || ev.key === 'F')) {
      settingStore.showSearch = true
      ev.preventDefault()
    }
    if (ev.key == "Escape") settingStore.showSearch = false
  }
  // 自动锁屏
  initTimer()
  document.onclick = () => initTimer()
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
  <GlobalSearch v-model:is-show="settingStore.showSearch"></GlobalSearch>
  <LockScreen v-if="settingStore.locked"></LockScreen>
</template>
