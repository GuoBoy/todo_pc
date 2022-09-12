<template>
  <div class="container">
    <el-form :model="userForm" ref="formRef" :rules="rules" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin()">注册</el-button>
        <el-button>
          <router-link to="/login">登录</router-link>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">

import { LoginForm } from '@/model/user';
import { reactive, ref } from 'vue'
import { FormInstance, ElMessage } from 'element-plus'
import { apiRegister } from '@/api';
import { useUserstore } from '@/store';
import { useRouter } from 'vue-router';
const userForm = reactive<LoginForm>({
  username: "",
  password: ""
})
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
const router = useRouter()

const onLogin = () => {
  console.log(formRef.value);
  formRef.value?.validate((v) => {
    if (!v) return

    apiRegister(userForm).then((res: any) => {
      if (res.code === 200) {
        ElMessage.success("注册成功")
        userStore.setLogin({ ...userForm, token: res.token }, 1)
        router.push("/")
      } else {
        ElMessage.error("注册失败，请检查注册信息~")
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