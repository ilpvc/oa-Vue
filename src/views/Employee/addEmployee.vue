<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item v-show="route.params.id" path="empNo" label="员工编号">
      <n-input v-model:value="modelRef.empNo" @keydown.enter.prevent
               placeholder="请输入员工编号" :disabled="route.params.id"/>
    </n-form-item>
    <n-form-item path="empName" label="员工姓名">
      <n-input v-model:value="modelRef.empName" @keydown.enter.prevent
               placeholder="请输入员工姓名"/>
    </n-form-item>
    <n-form-item path="empSex" label="员工性别">
      <n-select
          v-model:value="modelRef.empSex"
          placeholder="性别"
          :options="['男','女'].map(v=>({label:v,value:v}))"/>
    </n-form-item>
    <n-form-item path="empAddress" label="学历">
      <n-select
          v-model:value="modelRef.empEducation"
          placeholder="员工学历"
          :options="allEducation"/>
    </n-form-item>
    <n-form-item :span="5" label="所属部门">
      <n-select
          v-model:value="modelRef.belongDept"
          placeholder="所属部门"
          :options="belongDept"/>
    </n-form-item>
    <n-form-item label="邮箱"
                 :feedback="emailFeedbackComputed"
                 :validation-status="emailStatusComputed">
      <n-input v-model:value="modelRef.empEmail" @keydown.enter.prevent
               placeholder="请输入邮箱"/>
    </n-form-item>
    <n-form-item path="empPhone" label="电话"
                 :validation-status="inputValidationStatus"
                 :feedback="inputFeedback">
      <n-input v-model:value="modelRef.empPhone" @keydown.enter.prevent
               placeholder="请输入电话号码" />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.empSex === null||
              modelRef.empPhone===null||
              modelRef.empName===null||
              inputValidationStatus!=='success'||
              emailStatusComputed==='error'"
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

import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {useDialog, useMessage} from "naive-ui"
import {useRoute} from "vue-router";
import {getEmployeeById, saveEmployee, updateEmployee} from "@/api/employee/employee";

const route = useRoute()
const dialog = useDialog()
const message = useMessage()
const store = useStore()
//所有的部门信息
let belongDept = [...store.state.deptStore.depts].map((v) => ({
  label: v,
  value: v
}));
//所有学历信息
const allEducation = ["无学历","初中","高中","大专","本科","硕士","博士","其他"].map(v=>({
  label:v,
  value:v
}))
//表单数据
const modelRef = ref({
  empNo: null,
  empName: null,
  empSex: null,
  empEmail: null,
  belongDept: null,
  empPhone: null,
  empEducation: null
});
//表单校验规则
const rules = {
  empNo: [
    {
      required: true,
      message: "请输入员工编号",
      trigger: ["input", "blur"]
    }
  ],
  empName: [
    {
      required: true,
      message: "请输入员工姓名",
      trigger: ["input", "blur"]
    }
  ],
  empSex: [
    {
      required: true,
      message: "请输入性别",
      trigger: ["input", "blur"]
    },
  ],
  empEducation: [
    {
      required: false,
    },
  ],
  empEmail: [
    {
      required: false,
    },
  ],
  empPhone: [
    {
      required: true,
      message: "请输入电话号码",
    }
  ]
};

//更新或者保存时触发
function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick:async () => {
      if (route.params.id) {
        await updateEmployee(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        await saveEmployee(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error('保存失败')
          }
        })
      }
      await store.dispatch('empStore/setAllEmpNoAndName')
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}

//检验电话号码是否合法
function createStatus(value) {
  if (value ===null){
    return
  }
  let reg = /^(1[0-9][0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
  switch (reg.test(value)) {
    case true:
      return "success";
    case false:
      return "error";
  }
}

function createFeedback(value) {
  if (value ===null){
    return
  }
  let reg = /^(1[0-9][0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
  switch (reg.test(value)) {
    case true:
      return ;
    case false:
      return "请输入正确的电话号码";
  }
}

let inputValidationStatus=computed(() => {
  return createStatus(modelRef.value.empPhone);
})
let inputFeedback=computed(() => {
  return createFeedback(modelRef.value.empPhone);
})


//邮箱检验后的状态
function emailStatus(){
  if (modelRef.value.empEmail===null){
    return void 0
  }
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(modelRef.value.empEmail))
    return "error"
  else
    return "success"

}
//邮箱检验后的回调
function emailFeedback(){
  if (modelRef.value.empEmail===null){
    return void 0
  }
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(modelRef.value.empEmail))
    return "请输入正确的邮箱"
}
//邮箱检验后的计算属性赋值
let emailStatusComputed=computed(() => {
  return emailStatus();
})
let emailFeedbackComputed=computed(() => {
  return emailFeedback();
})

//初始化方法
function init(){
  const deptsMap = store.state.deptStore.deptsMap
  if (route.params.id){
    getEmployeeById(route.params.id).then(res=>{
      modelRef.value = {...res.data.item}
      modelRef.value.belongDept = deptsMap.get(res.data.item.empDeptId)
    })

  }else {

    nextTick(()=>{
      modelRef.value.empId=null
      modelRef.value.empNo=null
      modelRef.value.empName=null
      modelRef.value.empSex=null
      modelRef.value.empEmail=null
      modelRef.value.belongDept=null
      modelRef.value.empPhone=null
      modelRef.value.empEducation=null
    })
  }
}

onMounted(()=>{
  init()
})

watch(()=>route.path,()=>{
  init()
})


</script>
