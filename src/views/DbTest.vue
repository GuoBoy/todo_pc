<template>
  <div class="dbtest">
    <div class="header">
      <el-select placeholder="选择历史查询" clearable filterable @change="(v: string) => sql = v">
        <el-option v-for="item in histories" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" @click="onExecute">执行</el-button>
      <el-button type="primary" @click="onExecuteSelect">执行select</el-button>
    </div>
    <textarea placeholder="输入sql" rows="10" v-model="sql"></textarea>
    <pre style="overflow: auto;">{{ result }}</pre>
  </div>
</template>
  
<script lang='ts' setup>
import { onMounted, reactive, ref } from "vue"
import { executer, executeSelect } from "@/store/database"

const sql = ref("")
const result = reactive({})
// 执行脚本
const onExecute = () => {
  executer(sql.value).then(res => {
    Object.assign(result, res)
  })
  recordHis()
}

// 执行select脚本
const onExecuteSelect = () => {
  executeSelect(sql.value).then(res => {
    Object.assign(result, res)
  })
  recordHis()
}

// 历史记录
const histories = ref<string[]>([])
const recordHis = () => {
  histories.value.unshift(sql.value)
  histories.value = Array.from(new Set(histories.value))
  histories.value = histories.value.filter(v => v !== "")
  localStorage.setItem("sql-history", JSON.stringify(histories.value))
}
onMounted(async () => {
  histories.value = JSON.parse(localStorage.getItem("sql-history") ?? '[]')
})
</script>
  
<style lang='scss' scoped>
.dbtest {
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr;

  .header {
    .el-select {
      width: 50%;
    }
  }
}
</style>
  