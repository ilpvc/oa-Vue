<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="userAccount" label="用户名">
      <n-input v-model:value="modelRef.userAccount" @keydown.enter.prevent
               placeholder="请输入用户名"/>
    </n-form-item>
    <n-form-item v-show="!route.params.id" path="userPwd" label="用户密码">
      <n-input v-model:value="modelRef.userPwd" @keydown.enter.prevent
               type="password"
               placeholder="请输入用户密码"/>
    </n-form-item>
    <n-form-item path="userStatus" label="用户状态">
      <n-select
          v-model:value="modelRef.userStatus"
          :options="statusInfo"
          placeholder="请输入用户状态"
      />
    </n-form-item>
    <n-form-item path="userRole" label="用户角色">
      <!--      <n-input v-model:value="modelRef.userRoleId" @keydown.enter.prevent-->
      <!--               placeholder="请输入用户角色"/>-->
      <n-select
          v-model:value="modelRef.userRole"
          :options="roleName"
          placeholder="请选择角色"
      />
    </n-form-item>
    <n-form-item path="userEmpNo" label="用户编号">
      <n-select v-model:value="modelRef.userEmpNo"
                placeholder="请绑定一个员工"
                :options="empNoAndName"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.userStatus === null||
              modelRef.userAccount===null||
              modelRef.userRole===null||
              modelRef.userEmpNo===null||
              modelRef.userPwd===null"
              round
              type="primary"
              @click="updateAndSave">
            提交
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {
  useMessage,
  useDialog
} from "naive-ui";
import {useStore} from "vuex";
import {useRoute} from "vue-router"
import {getUserById, getUserByName, saveUser, updateUser} from "@/api/account/account";

const route = useRoute()
const store = useStore()
const formRef = ref(null);
const message = useMessage();
const dialog = useDialog()

const modelRef = ref({
  userAccount: null,
  userStatus: null,
  userRole: null,
  userEmpNo: null,
  userPwd: null
});

const rules = {
  userAccount: [
    {
      required: true,
      validator: async (rules, value) => {
        return new Promise((resolve, reject) => {
          getUserByName(value).then((res)=>{
            if (res.code === 400){
              resolve();
            }else{
              reject(Error("用户名已存在"));
            }
          })
        });

      },
      trigger: ["input", "blur"],

    }
  ],
  userStatus: [
    {
      required: true,
      message: "请选择用户状态",
      trigger: ["input", "blur"]
    }
  ],
  userRole: [
    {
      required: true,
      message: "请选择用户角色",
      trigger: ["input", "blur"]
    },
  ],
  userEmpNo: [
    {
      required: false,
      message: "请输入用户的编号",
      trigger: ["input", "blur"]
    },
  ],
  userPwd: [
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
  ]
};

const empNoAndName = store.state.empStore.allEmpNoAndName.map(v => ({
  label: v,
  value: v
}))


let roles = store.state.roleStore.roles
let roleName = store.state.roleStore.allRolesName.map((v) => ({
  label: v,
  value: v
}))

let statusInfo = ["正常", "禁用", "删除"].map((v) => ({
  label: v,
  value: v
}))

//初始化数据
function init() {
  if (route.params.id) {
    getUserById(route.params.id).then(res => {
      modelRef.value = {...res.data.item}
      modelRef.value.userRole = roles.get(res.data.item.userRoleId)
      modelRef.value.userStatus = checkUserStatus(res.data.item)
    })

  } else {

    nextTick(() => {
      modelRef.value.userAccount = null
      modelRef.value.userStatus = null
      modelRef.value.userRole = null
      modelRef.value.userEmpNo = null
      modelRef.value.userPwd = null
    })
  }
}


//查询用户状态
function checkUserStatus(item) {
  if (item.userStatus === 0) {
    return "正常"
  }
  if (item.userStatus === 1) {
    return "禁用"
  }
  if (item.userStatus === 2) {
    return "删除"
  }
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})


function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick: () => {
      if (route.params.id) {
        updateUser(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        saveUser(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error('保存失败')
          }
        })
      }
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}

</script>