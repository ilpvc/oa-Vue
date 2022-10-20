<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item v-show="route.params.id" path="classNo" label="编号">
      <n-input v-model:value="modelRef.classNo" @keydown.enter.prevent
               placeholder="请输入编号" :disabled="true"/>
    </n-form-item>
    <n-form-item path="classUser" label="教师">
<!--      <n-input v-model:value="modelRef.classUser" @keydown.enter.prevent-->
<!--               placeholder="填入班主任姓名"/>-->
      <n-select v-model:value="modelRef.classUser"
                placeholder="请选择教师"
                :options="allEduEmp"/>
    </n-form-item>
    <n-form-item path="className" label="班级名">
      <n-input v-model:value="modelRef.className" @keydown.enter.prevent
               placeholder="请输入班级名"/>
    </n-form-item>
    <n-form-item path="classAddress" label="班级位置">
      <n-input v-model:value="modelRef.classAddress" @keydown.enter.prevent
               placeholder="班级位置"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.classUser === null||
              modelRef.classAddress===null||
              modelRef.className===null"
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
import {useStore} from "vuex";
import {useDialog, useMessage} from "naive-ui"
import {useRoute} from "vue-router";
import {getClassById, saveClass, updateClass} from "@/api/class/class";

const route = useRoute()
const dialog = useDialog()
const message = useMessage()
const store = useStore()

const modelRef = ref({
  classNo:null,
  className:null,
  classUser:null,
  classAddress:null
});

//表单规则验证
const rules = {
  className: [
    {
      required: true,
      message: "请输入班级名",
      trigger: ["input", "blur"]
    }
  ],
  classUser: [
    {
      required: true,
      message: "请请选择教师",
      trigger: ["input", "blur"]
    },
  ],
  classAddress: [
    {
      required: true,
      message: "请输入班级位置",
      trigger:["input",'blur']
    },
  ]
};
let allEduEmp=eduEmpInit()

//初始化所有教学部的员工作为教师的可选项
function eduEmpInit(){
  const deptsMap = store.state.deptStore.deptsMap
  let deptId
  for (const [key,value] of deptsMap) {
    if (value==="教学部") deptId= key
  }
  const allEmp = store.state.empStore.allEmployeeData
  let eduEmp=[]
  for (const [key,value] of allEmp) {
    if (value.empDeptId===deptId){
      eduEmp.push(value.empNo+"-"+value.empName)
    }
  }
  return eduEmp.map(v=>({
    label:v,
    value:v
  }))
}


//更新或者保存时触发
function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick:async () => {
      if (route.params.id) {
        await updateClass(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        await saveClass(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error(res.message)
          }
        })
      }
      await store.dispatch('classStore/setClass')
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}

//初始化
function init(){
  const allEmp = store.state.empStore.allEmployeeData
  if (route.params.id){
    getClassById(route.params.id).then(res=>{
      modelRef.value = {...res.data.class}
      let classUser = allEmp.get(parseInt(res.data.class.classUser))
      modelRef.value.classUser = classUser.empNo+'-'+classUser.empName
      console.log(modelRef.value.classUser)
    })

  }else {

    nextTick(()=>{
      modelRef.value.classId=null
      modelRef.value.classNo=null
      modelRef.value.classUser=null
      modelRef.value.className=null
      modelRef.value.classAddress=null
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
