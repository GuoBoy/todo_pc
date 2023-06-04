<template>
  <div class="container">
    <Setting></Setting>
    <el-form :model="userForm" ref="formRef" :rules="rules" label-width="70px">
      <h1 style="text-align: center;">登录</h1>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin()" style="width: 100%;">登录</el-button>
      </el-form-item>
      <router-link to="/register" style="position: absolute;right: 0;">去注册</router-link>
    </el-form>
  </div>
</template>
<script setup lang="ts">

import { LoginForm } from '@/model/user';
import { reactive, ref } from 'vue'
import { FormInstance, ElMessage } from 'element-plus'
import { apiLogin } from '@/api';
import { useUserstore } from '@/store/user';
import Setting from './Setting.vue';
import { useLogStore } from '@/store/logs';
const userForm = reactive<LoginForm>({ username: "", password: "" })
const rules = {
  username: [
    { required: true, message: '输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
}
const formRef = ref<FormInstance>()
const userStore = useUserstore()
const onLogin = () => {
  formRef.value?.validate((v) => {
    if (!v) return
    apiLogin(userForm).then((res: any) => {
      if (res.code === 200) {
        userStore.saveLogin(userForm.username, res.token)
        useLogStore().add("登录成功")
      } else {
        ElMessage.error("登录失败，请检查登录信息~")
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.container {

  position: relative;
  width: 100%;
  height: 100%;

  .el-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

}
</style>