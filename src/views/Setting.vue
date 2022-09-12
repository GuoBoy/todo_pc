<template>
  <div class="setting-page">
    <el-button class="return-btn" type="warning" @click="router.push('/')">返回
    </el-button>
    <div class="setting-item">
      <div class="title">服务器地址：</div>
      <div class="item-detail">
        <el-input v-model="addr">
          <template #append>
            <el-button-group>
              <el-button @click="settingStore.setServerAddr(addr)">修改</el-button>
              <el-button @click="testServer">测试链接</el-button>
              <el-button @click="addr='',showUseful=false">重置</el-button>
            </el-button-group>
          </template>
        </el-input>
        <el-tag :type="serverUseful?'success':'danger'" v-if="showUseful">测试结果</el-tag>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { apiTestServer } from '@/api';
import { useSettingStore } from '@/store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const addr = ref('')
const settingStore = useSettingStore()
onMounted(() => {
  addr.value = settingStore.serverAddr
})

const serverUseful = ref(false)
const showUseful = ref(false)
const testServer = () => {
  showUseful.value = true
  apiTestServer(addr.value).then((res: any) => {
    if (res.code === 200) {
      serverUseful.value = true
      return
    }
    serverUseful.value = false
  }).catch(e => {
    serverUseful.value = false
  })
}

</script>

<style scoped lang="scss">
.setting-page {
  .setting-item {
    display: flex;
    align-items: center;
    margin: 5px;

    .el-input {
      width: 80vw;
    }
  }

  .return-btn {
    margin: 10px;
    width: 30%;
  }
}
</style>