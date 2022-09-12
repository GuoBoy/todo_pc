<template>
  <div class="title-bar">
    <div class="menus">
      <!-- <img src="../assets/vite.svg" alt="">  -->
      <router-link to="/setting">设置</router-link>
    </div>
    <!-- <div class="title">
      {{setting.title}}
    </div> -->
    <el-dropdown class="userinfo">
      <span class="el-dropdown-link">
        {{userStore.userInfo?.username}}
      </span>
      <template #dropdown>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore, useUserstore } from '@/store';
import { useRouter } from 'vue-router';


const userStore = useUserstore()
// const setting = useSettingStore()
const router = useRouter()
const logout = () => {
  userStore.setLoginOut()
  router.push("/login")
}

</script>

<style lang="scss" scoped>
.title-bar {
  position: absolute;
  height: $title_bar_height;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: .1vh solid #000;

  .menus {
    white-space: nowrap;
    cursor: pointer;

    img {
      height: 80%;
      margin-left: 2px;
    }
  }
}

a {
  text-decoration: none;
  color: black;
}
</style>