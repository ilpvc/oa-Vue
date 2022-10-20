<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item v-show="route.params.id" path="stuNo" label="编号">
      <n-input v-model:value="modelRef.stuNo" @keydown.enter.prevent
               placeholder="请输入编号" :disabled="route.params.id!==undefined"/>
    </n-form-item>
    <n-form-item path="stuName" label="学生姓名">
      <n-input v-model:value="modelRef.stuName" @keydown.enter.prevent
               placeholder="请输入学生姓名"/>
    </n-form-item>
    <n-form-item path="stuClassId" label="所在班级">
      <n-select v-model:value="modelRef.stuClassId"
                :options="allClassNoAndName"
                placeholder="选择班级"/>
    </n-form-item>
    <n-form-item path="stuSex" label="性别">
      <n-select
          v-model:value="modelRef.stuSex"
          placeholder="性别"
          :options="['男','女'].map(v=>({label:v,value:v}))"/>
    </n-form-item>
    <n-form-item path="stuEmail" label="邮箱"
                 :feedback="emailFeedbackComputed"
                 :validation-status="emailStatusComputed">
      <n-input v-model:value="modelRef.stuEmail" @keydown.enter.prevent
               placeholder="请输入邮箱"/>
    </n-form-item>
    <n-form-item path="stuPhone" label="电话"
                 :validation-status="inputValidationStatus"
                 :feedback="inputFeedback">
      <n-input v-model:value="modelRef.stuPhone" @keydown.enter.prevent
               placeholder="请输入电话"/>
    </n-form-item>
    <n-form-item label="入学日期"  path="stuEntryTime">
      <n-date-picker v-model:value="modelRef.stuEntryTime" type="datetime"/>
    </n-form-item>

    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.stuName===null||
              modelRef.stuClassId===null||
              modelRef.stuSex===null||
              modelRef.stuPhone===null||
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
import {getStudentById, saveStudent, updateStudent} from "@/api/student/student";
import moment from "moment";

const route = useRoute()
const dialog = useDialog()
const message = useMessage()
const store = useStore()

const modelRef = ref({
  stuNo: null,
  stuName: null,
  stuClassId: null,
  stuSex: null,
  stuEmail: null,
  stuPhone: null,
  stuEntryTime: null
});
//表单验证规则
const rules = {
  stuNo: [
    {
      required: true,
      message: "请输入学号",
      trigger: ["input", "blur"]
    }
  ],
  stuName: [
    {
      required: true,
      message: "请输入学生姓名",
      trigger: ["input", "blur"]
    }
  ],
  stuClassId: [
    {
      required: true,
      message: "请输入所在班级",
      trigger: ["input", "blur"]
    },
  ],
  stuSex: [
    {
      required: true,
    },
  ],
  stuEmail: [
    {
      required: false,
    },
  ],
  stuPhone: [
    {
      required: true,
    }
  ],
  stuEntryTime: [
    {
      required: false,
      message: "请输入电话号码"
    }
  ]
};

//更新或者保存调用
function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick: () => {
      if (route.params.id) {
        updateStudent(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        saveStudent(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error('保存失败')
          }
        })
      }
    },
    onNegativeClick: () => {
      message.error('保存失败')
    }
  })
}

//初始化操作
function init() {
  const allClassNoAndNameMap = store.state.classStore.allClassNoAndNameMap
  if (route.params.id) {
    getStudentById(route.params.id).then(res => {
      modelRef.value = {...res.data.item}
      //将时间转换为时间戳(毫秒级),在转为number类型
      modelRef.value.stuEntryTime=parseInt(moment(modelRef.value.stuEntryTime).format("x"))
      modelRef.value.stuClassId = allClassNoAndNameMap.get(res.data.item.stuClassId)
    })

  } else {

    nextTick(() => {
      modelRef.value.stuId = null
      modelRef.value.stuName = null
      modelRef.value.stuNo = null
      modelRef.value.stuEmail = null
      modelRef.value.stuPhone = null
      modelRef.value.stuSex = null
      modelRef.value.stuEntryTime = null
      modelRef.value.stuClassId = null
    })
  }
}

//所有的班级选项
let allClassNoAndName = [...store.state.classStore.allClassNoAndName].map(v=>({
  label:v,
  value:v
}))

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
  return createStatus(modelRef.value.stuPhone);
})
let inputFeedback=computed(() => {
  return createFeedback(modelRef.value.stuPhone);
})


//邮箱检验后的状态
function emailStatus(){
  if (modelRef.value.stuEmail===null){
    return void 0
  }
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(modelRef.value.stuEmail))
    return "error"
  else
    return "success"

}
//邮箱检验后的回调
function emailFeedback(){
  if (modelRef.value.stuEmail===null){
    return void 0
  }
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!reg.test(modelRef.value.stuEmail))
    return "请输入正确的邮箱"
}
//邮箱检验后的计算属性赋值
let emailStatusComputed=computed(() => {
  return emailStatus();
})
let emailFeedbackComputed=computed(() => {
  return emailFeedback();
})

//生命周期钩子函数
onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})


</script>
