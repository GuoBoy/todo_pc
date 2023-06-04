<template>
  <div class="userinfo">
    <div class="item">
      <h3 class="title">个人信息</h3>
      <div class="info">
        <el-icon>
          <user />
        </el-icon>
        <div class="desc">{{ userStore.username }}</div>
      </div>
    </div>
  </div>
  <el-button type="warning" @click="isChangePwd = !isChangePwd">{{ isChangePwd ? "取消" : "修改密码" }}</el-button>
  <el-button type="danger" @click="userStore.saveLoginout">退出登录</el-button>
  <el-form v-if="isChangePwd" :model="pwdForm" :rules="rules" ref="formRef" class="reset-pwd">
    <el-form-item label="旧密码" prop="o">
      <el-input v-model="pwdForm.o" type="password"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="n">
      <el-input v-model="pwdForm.n" type="password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onChangePwd">确定修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { useUserstore } from '@/store/user';
import { reactive, ref } from 'vue';
import { PwdForm } from '@/model/user';
import { FormInstance } from 'element-plus';
import { apiChangePassword } from '@/api';
import { encryptToForm } from '@/crypt';
import { useLogStore } from '@/store/logs';

const userStore = useUserstore()
const logStore = useLogStore()
const isChangePwd = ref(false)
const pwdForm = reactive<PwdForm>({ o: "", n: "" })
const rules = {
  o: [
    { required: true, message: '输入旧密码', trigger: 'blur' },
  ],
  n: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ]
}
const formRef = ref<FormInstance>()
// 修改密码
const onChangePwd = () => {
  formRef.value?.validate((v) => {
    if (!v) return
    apiChangePassword(encryptToForm(pwdForm)).then((res: any) => {
      logStore.add("密码修改成功")
    })
  })
}

</script>

<style scoped lang="scss">
.userinfo {
  margin: 10px 50px;

  .item {
    .info {
      display: flex;
      align-items: center;

      .desc {
        margin: 5px;
        word-wrap: break-word;
      }
    }
  }
}

.reset-pwd {
  margin: 10px 50px;
}
</style>
