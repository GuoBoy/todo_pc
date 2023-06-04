<template>
  <div class="feedback">
    <h1>问题反馈</h1>
    <el-input type="textarea" :rows="5" v-model="msg" placeholder="输入发现的问题">
    </el-input>
    <el-upload :action="actionUrl" :headers="headers" :on-remove="onRemoveFile" :on-success="onSuccess"
      :on-error="onError" list-type="picture-card" ref="uploadRef">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <el-button type="primary" @click="onSend">提交</el-button>
  </div>
</template>
  
<script lang='ts' setup>
import { useSettingStore } from '@/store';
import { computed, ref } from 'vue';
import { concatURIs } from "@/hooks/utils"
import { Plus } from "@element-plus/icons-vue"
import { useUserstore } from '@/store/user';
import { ElMessage, UploadFile, UploadFiles, UploadInstance } from 'element-plus';
import { useLogStore } from '@/store/logs';
import { LogType } from '@/model/system';
import { apiDelAttachment, apiSendFeedback } from "@/api/feedback"

const msg = ref("")
const settingStore = useSettingStore()
const actionUrl = computed(() => concatURIs(settingStore.serverAddr, "file"))
const userStore = useUserstore()
const headers = computed(() => {
  return { "Authorization": userStore.token }
})
const logStore = useLogStore()
const fileList = ref<string[]>([])
// 删除已上传文件
const onRemoveFile = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(uploadFile, uploadFiles);
  //@ts-ignore
  const filename = uploadFile?.response.data
  apiDelAttachment(filename).then((res: any) => {
    if (res.code === 200) {
      fileList.value = fileList.value.filter(v => v !== filename)
      logStore.add("删除反馈附件成功" + filename, LogType.success)
    } else {
      logStore.add("删除反馈附件失败" + res.msg, LogType.error)
    }
  })
}
const uploadRef = ref<UploadInstance>()
// 附件上传成功
const onSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code !== 200) {
    logStore.add("上传反馈附件失败" + response.msg, LogType.error)
    return
  }
  fileList.value.push(response.data)
  logStore.add("上传反馈附件成功" + response.data, LogType.success)
}
// 文件上传失败
const onError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log(error, uploadFile, uploadFiles);
  logStore.add("上传反馈附件失败" + error.message, LogType.error)
}
// 提交反馈
const onSend = () => {
  if (msg.value === "") {
    ElMessage.error("未填写内容")
    return
  }
  apiSendFeedback({ message: msg.value, images: fileList.value.join("|") }).then((res: any) => {
    if (res.code !== 200) {
      logStore.add("发送反馈失败" + res.msg, LogType.error)
      return
    }
    msg.value = ""
    uploadRef.value?.clearFiles()
    logStore.add("反馈成功:" + res.data, LogType.success)
  })
}
</script>
  
<style lang='scss' scoped></style>
  