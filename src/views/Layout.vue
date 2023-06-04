<template>
  <div class="layout">
    <!-- 应用菜单 -->
    <div class="aside">
      <el-menu :default-active="activeMenu" router>
        <el-menu-item v-for="menu in menus" :key="menu.name" :index="menu.name"> {{ menu.title }} </el-menu-item>
      </el-menu>
      <!-- userinfo -->
      <div class="user" @click="settingDialogVisable = true"> {{ userStore.username }} </div>
    </div>
    <div class="main-container">
      <div class="router">
        <!-- 所有缓存 -->
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component"></component>
          </KeepAlive>
        </RouterView>
      </div>
      <!-- 底部消息栏 -->
      <div class="footer-infos">
        <!-- 单条日志 -->
        <div @click="isShowAllLogs = true" v-if="!isShowAllLogs" :style="`color:${logStore.currentLog.color()}`">{{
          logStore.currentLog.toString() }}
        </div>
        <div class="logs" v-else>
          <el-icon @click="isShowAllLogs = !isShowAllLogs" id="hidden-log">
            <ArrowDown></ArrowDown>
          </el-icon>
          <el-icon @click="logStore.clearLogs" id="clear-log">
            <CloseBold></CloseBold>
          </el-icon>
          <div v-for="(item, index) in logStore.logs" :key="index" class="item">
            <span class="index">{{ index + 1 }}</span>
            <span class="info" :style="`color:${item.color()}`">{{ item.toString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 设置对话框，点击用户名显示 -->
  <el-dialog v-model="settingDialogVisable" width="90%" class="user-setting-dia" title="设置">
    <el-tabs tab-position="left" style="height: 60vh;">
      <el-tab-pane key="userinfo" label="个人">
        <Center></Center>
      </el-tab-pane>
      <el-tab-pane key="system" label="系统">
        <Setting></Setting>
      </el-tab-pane>
      <el-tab-pane key="feedback" label="反馈">
        <feedback></feedback>
      </el-tab-pane>
      <el-tab-pane key="about" label="关于">
        <About></About>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
  
<script lang='ts' setup>
import { computed, onMounted, ref } from "vue";
import { menus } from "@/hooks/menus"
import Center from './Center.vue';
import Setting from './Setting.vue';
import About from './About.vue';
import Feedback from "./Feedback.vue";
import { useUserstore } from "@/store/user";
import { useLogStore } from "@/store/logs";
import { ArrowDown, CloseBold } from "@element-plus/icons-vue"
import { useRouter } from "vue-router";

const userStore = useUserstore()
const settingDialogVisable = ref(false)
// 底部消息日志
const logStore = useLogStore()
const isShowAllLogs = ref(false)  // 是否显示所有日志

const activeMenu = ref(menus[0].name);
onMounted(() => useRouter().push(activeMenu.value))

// 侧边状态
const menuIsHidden = ref(false)
const menuWidth = computed(() => menuIsHidden.value ? '50px' : '100px')
</script>
  
<style lang='scss' scoped>
.layout {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100%;
  overflow: auto;

  .aside {
    display: grid;
    grid-template-rows: 1fr auto;

    // 用户信息
    .user {
      cursor: pointer;
      background: #a0c9fb;
      text-align: center;
      font-weight: bolder;
    }
  }

  .main-container {
    height: 100%;
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr auto;

    .router {
      height: 100%;
      overflow: auto;
    }

    // 日志信息
    .footer-infos {
      cursor: pointer;

      // 所有日志
      .logs {
        overflow-y: auto;
        height: 20vh;
        background: #fff;

        #hidden-log,
        #clear-log {
          position: absolute;
          right: 15px;
        }

        #clear-log {
          bottom: 0;
        }

        .item {
          display: flex;
          font-size: small;

          .index {
            width: 2vw;
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>
  