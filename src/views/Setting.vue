<template>
  <div class="setting">
    <div class="item">
      <label for="server-addr">服务器地址</label>
      <div class="item-detail" id="server-addr">
        <el-input v-model="addr" clearable class="server-input" />
        <el-tag :type="serverUseful ? 'success' : 'danger'" v-if="showUseful">{{ serverUseful ? "连接正常" : "无法连接" }}
        </el-tag>
        <div class="btns">
          <el-button @click="testServer" type="primary" :icon="Pointer"></el-button>
          <el-button @click="settingStore.saveServerAddr(addr)" type="warning">修改</el-button>
        </div>
      </div>
    </div>
    <div class="item">
      <label for="server-addr">锁屏时长设置(秒，建议大于30s)</label>
      <div class="item-detail">
        <el-input-number v-model="locktimeTemp" :min="1" :max="1000000" />
        <div class="btns">
          <el-button @click="settingStore.setLockTimelength(locktimeTemp)" type="warning">修改</el-button>
        </div>
      </div>
    </div>
    <div class="item">
      <el-button type="danger" @click="useGroupItemStore().clearLocalStore">清空缓存</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiTestServer } from '@/api';
import { useSettingStore } from '@/store';
import { useGroupItemStore } from "@/store/groupItem"
import { onMounted, ref } from 'vue';
import { Pointer } from "@element-plus/icons-vue"

const addr = ref('')
const settingStore = useSettingStore()
onMounted(() => {
  addr.value = settingStore.serverAddr
  locktimeTemp.value = settingStore.lockTimelength / 1000
})

const serverUseful = ref(false)
const showUseful = ref(false)
const testServer = () => {
  showUseful.value = true
  apiTestServer(addr.value).then((res: boolean) => serverUseful.value = res).catch(_ => serverUseful.value = false)
}

// 锁屏时长
const locktimeTemp = ref(60)
</script>

<style scoped lang="scss">
.setting {
  .item {
    display: flex;
    align-items: center;
    margin: 5px;

    .item-detail {
      display: flex;
      align-items: center;

      .server-input {
        width: 35vw;
        margin: 0 5px;
        padding: 5px;
      }

      .btns {
        display: flex;
        margin: 0 10px;
      }
    }
  }
}
</style>