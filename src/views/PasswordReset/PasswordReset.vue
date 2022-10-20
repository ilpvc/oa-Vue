<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="oldPassword" label="原密码">
      <n-input v-model:value="modelRef.oldPassword" @keydown.enter.prevent
               placeholder="请输入原密码"
               type="password"/>
    </n-form-item>
    <n-form-item path="password" label="新密码">
      <n-input
          v-model:value="modelRef.password"
          type="password"
          placeholder="请输入新密码"
          @input="handlePasswordInput"
          @keydown.enter.prevent/>
    </n-form-item>
    <n-form-item
        ref="rPasswordFormItemRef"
        first
        path="reenteredPassword"
        label="重复密码">
      <n-input
          v-model:value="modelRef.reenteredPassword"
          :disabled="!modelRef.password"
          type="password"
          placeholder="请输入确认密码"
          @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.oldPassword === null||
                         modelRef.password === null||
                         modelRef.reenteredPassword !== modelRef.password"
              round
              type="primary"
              @click="resetPassword">
            提交
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>

</template>

<script setup>
import {ref} from "vue";
import {
  useMessage
} from "naive-ui";
import {useStore} from "vuex";
import {resetUserPassword} from "@/api/account/account";
import {removeToken} from "@/utils/auth";
import {useRouter} from "vue-router";

const router = useRouter()
const store = useStore()
const formRef = ref(null);
const rPasswordFormItemRef = ref(null);
const message = useMessage();
const modelRef = ref({
  oldPassword: null,
  password: null,
  reenteredPassword: null
});

function validatePasswordStartWith(rule, value) {
  return !!modelRef.value.password && modelRef.value.password.startsWith(value) && modelRef.value.password.length >= value.length;
}

function validatePasswordSame(rule, value) {
  return value === modelRef.value.password;
}

//表单验证规则
const rules = {
  oldPassword: [
    {
      required: true,
      validator(rule, value) {
        let reg = /\w{6,17}$/
        if (reg.test(value) && value.length <= 18) {
          return true;
        } else {
          return new Error("请输入6-18位的密码");
        }

      },
      trigger: ["input", "blur"]
    }
  ],
  password: [
    {
      required: true,
      validator(rule, value) {
        let reg = /\w{6,17}$/
        if (reg.test(value) && value.length <= 18) {
          return true;
        } else {
          return new Error("请输入6-18位的密码");
        }
      },
      trigger: ["input", "blur"]
    }
  ],
  reenteredPassword: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: ["input", "blur"]
    },
    {
      validator: validatePasswordStartWith,
      message: "两次密码输入不一致",
      trigger: "input"
    },
    {
      validator: validatePasswordSame,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"]
    }
  ]
};

//密码和重复密码是否相同
function handlePasswordInput() {
  if (modelRef.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({trigger: "password-input"});
  }
}

//提交数据
async function resetPassword() {
  let userId = sessionStorage.getItem("userId")
  let userName = sessionStorage.getItem("userName")
  let resetUser = {
    userId,
    userName,
    oldPassword: modelRef.value.oldPassword,
    newPassword: modelRef.value.password
  }
  await resetUserPassword(resetUser).then(res=>{
    if (res.code ==200){
      message.loading("正在修改")
      removeToken()
      setTimeout(()=>{
        message.success("修改成功，需要重新登录")
        router.push({name: 'login'})
      },2000)
    }else {
      message.warning(res.message)
    }
  })

}


</script>