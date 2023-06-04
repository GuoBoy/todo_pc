<template>
  <div class="groups-container">
    <!-- 新建分组 -->
    <div class="top-btns">
      <el-icon class="item-btn" @click="refresher.refreshGroups">
        <Refresh />
      </el-icon>
      <el-icon class="item-btn" @click="newGroupDialogVisiable = true">
        <Plus />
      </el-icon>
    </div>
    <!-- Groups -->
    <ul class="items">
      <li v-if="groups.length === 0"><!-- 不存在分组显示 -->
        <p style="cursor: pointer;text-align: center;" @click="newGroupDialogVisiable = true">啥也没有，点我新建分组！</p>
      </li>
      <!-- todo分组 -->
      <li :class="['group-item', group.id === groupItemStore.currentGroup?.id ? 'current-selected' : '']"
        v-for="group in                    groups                    " :key="group.id">
        <img src="../assets/group_logo.png" alt="" class="item-icon">
        <span @click="groupItemStore.changeCurGroup(group.id)">{{ group.name }}</span>
        <div class="right">
          <!-- 下拉菜单 -->
          <el-dropdown>
            <span> <el-icon size="22">
                <More />
              </el-icon> </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="refresher.refreshGroupByID(group.id)">刷新 </el-dropdown-item>
                <el-dropdown-item @click="groupChangeDialogVisiable = true; Object.assign(currentGroup, group) ">重命名
                </el-dropdown-item>
                <el-dropdown-item @click=" onDelGroup(group) ">删除 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </li>
    </ul>
    <!-- 新建分组对话框 -->
    <el-dialog title="新建分组" v-model=" newGroupDialogVisiable " width="40%">
      <el-input placeholder="输入分组名称" clearable v-model=" newGroupName "></el-input>
      <template #footer>
        <span>
          <el-button @click=" newGroupDialogVisiable = false; newGroupName = '' ">取消</el-button>
          <el-button type="primary" @click=" onAddGroup ">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改分组对话框 -->
    <el-dialog title="修改分组" v-model=" groupChangeDialogVisiable " width="40%">
      <el-input clearable v-model=" currentGroup.name "></el-input>
      <template #footer>
        <span>
          <el-button @click=" groupChangeDialogVisiable = false; ">取消</el-button>
          <el-button type="primary" @click=" updateGroupName ">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { apiAddGroup, apiDelGroup, apiUpdateGroup } from '@/api/group';
import { Plus, Refresh, More } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { useRefreasher } from "@/hooks/refresh"

import { useGroupItemStore } from '@/store/groupItem';
import { GroupModel } from '@/model/item_group';
import { DelGroups, upGroupName } from '@/store/database';
import { useLogStore } from '@/store/logs';
import { LogType } from '@/model/system';

const groupItemStore = useGroupItemStore()
const groups = computed(() => groupItemStore.groups)
const logStore = useLogStore()

// new group
const newGroupDialogVisiable = ref(false)
const newGroupName = ref("")
const onAddGroup = () => {
  if (newGroupName.value === "") {
    ElMessage.error("请输入正确名称")
    return
  }
  apiAddGroup(newGroupName.value).then((res: any) => {
    if (res.code === 200) {
      groupItemStore.addGroups([{ id: res.data.id, name: newGroupName.value }], res.data.update_time)
      logStore.add("添加成功")
      newGroupDialogVisiable.value = false
    }
  })
}
const currentGroup = reactive<GroupModel>({ id: 0, name: "", updated_at: "" })
const groupChangeDialogVisiable = ref(false)
const updateGroupName = async () => {
  const { id, name } = currentGroup
  const res: any = await apiUpdateGroup(id, name)
  if (res.code === 200) {
    await upGroupName(id, name)
    groupItemStore.loadGroups()
    groupChangeDialogVisiable.value = false
    logStore.add("修改成功")
  } else {
    logStore.add("修改失败", LogType.error)
  }
}
// 删除分组
const onDelGroup = (group: GroupModel) => {
  ElMessageBox.confirm(`确定要删除ID:${group.name}?`, '提示', { confirmButtonText: "确定", cancelButtonText: "我再想一想", type: 'warning' }).then(_ => {
    apiDelGroup(group.id).then((res: any) => {
      if (res.code === 200) {
        DelGroups(group.id).then(() => { })
        groupItemStore.loadGroups()
        groupChangeDialogVisiable.value = false
        groupItemStore.currentGroup = undefined
        logStore.add("删除成功")
      } else {
        logStore.add("删除失败", LogType.error)
      }
    })
  }).catch(_ => {
    ElMessage.warning("取消删除")
  })
}
// 刷新器
const refresher = useRefreasher()
</script>

<style lang="scss" scoped>
.groups-container {
  height: 100%;
  overflow: auto;
  display: grid;
  grid-template-rows: auto 1fr;

  //顶部按钮
  .top-btns {
    display: flex;
    justify-content: space-around;

    .item-btn {
      width: 100%;
      padding: 3px 0;
    }

    .item-btn:hover {
      background-color: #77b9fb;
      color: #fff;
    }
  }

  // 分组列表
  .items {

    .group-item {
      font-weight: bolder;
      display: flex;
      align-items: center;
      position: relative;
      user-select: none;

      //分组图标
      .item-icon {
        width: 16px;
        padding: 5px;
        border-radius: 16px;
      }

      //分组按钮
      .right {
        position: absolute;
        right: 0;
        display: none;
      }
    }

    //显示分组修改按钮
    .group-item:hover .right {
      display: block;
    }
  }
}

// 当前选中
.current-selected {
  color: #409eff;
  background: rgb(241, 239, 239);
  border-radius: 5px;
  padding: 3px;
  margin: 6px 0 6px 6px;
}
</style>