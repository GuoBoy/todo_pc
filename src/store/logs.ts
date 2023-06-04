import { LogModel, LogType } from "@/model/system";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

// 全局日志
export const useLogStore = defineStore("log-store", () => {
  const logs = ref<LogModel[]>([])

  const currentLog = computed(() => logs.value.length !== 0 ? logs.value[0] : new LogModel("日志已清空"))
  // 添加日志
  const add = (msg: string, type?: LogType) => {
    // 默认成功
    type = type ?? LogType.success
    logs.value.unshift(new LogModel(msg, type))
    switch (type) {
      case LogType.success:
        ElMessage.success(msg)
        break;
      case LogType.info:
        ElMessage.info(msg)
        break
      case LogType.error:
        ElMessage.error(msg)
        break
    }
  }

  const clearLogs = () => logs.value = []

  return {
    logs, currentLog, add, clearLogs
  }
})