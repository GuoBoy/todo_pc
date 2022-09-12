<script setup lang="ts">
import zhCn from 'element-plus';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { initStore, useUserstore } from './store';

const router = useRouter()
const userStore = useUserstore()

onMounted(() => {
  initStore()
  if (!userStore.logined) router.push("/login")
})

</script>

<template>
  <el-config-provider :locale="zhCn">
    <TitleBar v-if="userStore.logined"></TitleBar>
    <router-view></router-view>
  </el-config-provider>
</template>

<style lang="scss">
@import url("./assets/global.css");
</style>
