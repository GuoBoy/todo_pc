<template>
  <el-button type="primary" size="small" :icon="Refresh" @click="refreshRecycle">刷新回收站数据</el-button>
  <div class="container">
    <!-- 删除的分组 -->
    <div class="c-item" v-for="group in groups" :key="group.id">
      <div class="info">
        <el-icon>
          <i-ep-Folder />
        </el-icon>
        <div style=" font-size: small;">{{ group.deleted_at }}</div>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" :icon="Unlock" @click="onGroupRecover(group.id)"></el-button>
        <el-button type="danger" :icon="DeleteFilled" size="small" @click="onGroupDel(group.id)">{{ group.id }}
        </el-button>
      </div>
      <span class="content"> {{ group.name }} </span>
    </div>
    <!-- 删除的item -->
    <div class="c-item" v-for="item in items" :key="item.id">
      <div class="info">
        <el-icon>
          <i-ep-Document />
        </el-icon>
        <div style=" font-size: small;">{{ item.deleted_at }}</div>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" :icon="Unlock" @click="onItemRecover(item.id)"></el-button>
        <el-button type="danger" :icon="DeleteFilled" size="small" @click="onItemDel(item.id)">{{ item.id }}
        </el-button>
      </div>
      <p class="content"> {{ item.detail }} </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { DeleteFilled, Unlock, Refresh } from "@element-plus/icons-vue"
import { apiGetRecycles, apiRecycleRecover } from "@/api/recycle";
import { recoverType } from "@/hooks/recycle"
import { apiForceDelToDoItem } from "@/api/index"
import { apiForceDelGroup } from "@/api/group"
import { RecycleGroupItem, RecycleItem } from "@/model/recycle";
import { useLogStore } from "@/store/logs";
import { LogType } from "@/model/system";

const logStore = useLogStore()

const groups = ref<RecycleGroupItem[]>([])
const items = ref<RecycleItem[]>([])
// 刷新回收站数据
const refreshRecycle = () => {
  apiGetRecycles().then((res: any) => {
    if (res.groups !== null) groups.value = res.groups;
    if (res.items !== null) items.value = res.items
    logStore.add("回收站刷新成功")
  })
}

const onGroupRecover = (id: number) => {
  apiRecycleRecover(id, recoverType.Group).then((res: any) => {
    if (res.code === 200) {
      groups.value = groups.value.filter(v => v.id !== id)
      logStore.add("恢复分组成功")
    }
  })
}
// 删除分组
const onGroupDel = (id: number) => {
  apiForceDelGroup(id).then((res: any) => {
    groups.value = groups.value.filter(v => v.id !== id)
    logStore.add(`强制删除分组`, res.code === 200 ? LogType.success : LogType.error)
  })
}
// 恢复item
const onItemRecover = (id: number) => {
  apiRecycleRecover(id, recoverType.Item).then((res: any) => {
    if (res.code === 200) {
      items.value = items.value.filter(v => v.id !== id)
      logStore.add("恢复item成功")
    }
  })
}
const onItemDel = (id: number) => {
  apiForceDelToDoItem(id).then((res: any) => {
    if (res.code === 200) {
      items.value = items.value.filter(v => v.id !== id)
      logStore.add("强制删除item成功")
    }
  })
}
onMounted(() => {
  refreshRecycle()
})

</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;

  .c-item {
    box-shadow: 0 2px 3px 1px rgba(0, 0, 255, .2);
    margin: 7px;
    width: 17vw;
    padding: 5px;

    .info {
      display: flex;
    }

    .content {
      overflow-wrap: break-word;
    }

    .btns {
      display: none;
    }
  }

  .c-item:hover .btns {
    display: block;
  }
}
</style>