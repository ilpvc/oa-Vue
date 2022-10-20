<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules" :disabled="route.params.id&&updateDisabled">
    <n-form-item v-show="route.params.id" path="reimburseNo" label="编号">
      <n-input v-model:value="modelRef.reimburseNo" @keydown.enter.prevent
               placeholder="请输入编号" :disabled="route.params.id!==undefined"/>
    </n-form-item>
    <n-form-item path="reimburseUser" label="请求人(员工号 姓名)">
      <n-select
          v-model:value="modelRef.reimburseUser"
          :options="allEmp"
          placeholder="请求人"
          :disabled="route.params.id!==undefined"
      />
    </n-form-item>
    <n-form-item path="reimburseType" label="报销类型">
      <n-select
          v-model:value="modelRef.reimburseType"
          :options="allReimburseType"
          placeholder="请输入报销类型"
      />
    </n-form-item>
    <n-form-item path="reimburseBz" label="报销事由">
      <n-input v-model:value="modelRef.reimburseBz" @keydown.enter.prevent
               placeholder="请输入报销事由"/>
    </n-form-item>
    <n-form-item path="reimburseStatus" label="申请状态">
      <n-select
          v-model:value="modelRef.reimburseStatus"
          :options="allReimburseStatus"
          placeholder="申请状态"/>
    </n-form-item>
    <n-form-item v-show="isShow" path="reimburseNoAgreen" label="(同意/驳回)原因">
      <n-input v-model:value="modelRef.reimburseNoAgreen" @keydown.enter.prevent
               placeholder="(同意/驳回)原因"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.reimburseUser===null||
              modelRef.reimburseType===null||
              modelRef.reimburseStatus===null||
              updateDisabled ||
              modelRef.reimburseBz===null"
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
import {getReimburseById, saveReimburse, updateReimburse} from "@/api/reimburse/reimburse";

const route = useRoute()
const store = useStore()
const formRef = ref(null);
const message = useMessage();
const dialog = useDialog()

const modelRef = ref({
  reimburseNo: null,
  reimburseUser: null,
  reimburseType: null,
  reimburseBz: null,
  reimburseStatus: null,
  reimburseNoAgreen: null,
});

//控制状态的数量
let isShow=ref(false)
//控制表单是否禁用
let updateDisabled = ref(false)
//所有可以选择的员工和员工号
let allEmp = [...store.state.empStore.allEmpNoAndName].map(v => ({
  label: v,
  value: v
}))
//用于选择的所有报销类型
let allReimburseType = [...getAllReimburseType()].map(v => ({
  label: v,
  value: v
}))
//用于选择的所有报销状态
let allReimburseStatus=[...getAllReimburseStatus().slice(0,2)].map((v) => ({
  label: v,
  value: v
}))


/**
 * 对报销状态进行数组形式封装
 * @returns {[]}
 */
function getAllReimburseStatus() {
  let item = store.state.reimburseStore.reimburseStatus
  let result = []
  for (const [key, value] of item) {
    result.push(value)
  }
  return result
}

/**
 * 对报销的数据进行数组封装
 * @returns {[]}
 */
function getAllReimburseType() {
  let allConfig = store.state.allConfigStore.configInfo
  let reimburseConfig = []
  for (const [key, config] of allConfig) {
    if (config.configType === "报销") {
      reimburseConfig.push(config.configName)
    }
  }
  return reimburseConfig
}


//所有参数的规则
const rules = {
  reimburseNo: [
    {
      required: true,
      message: "编号",
      trigger: ["input", "blur"]
    }
  ],
  reimburseUser: [
    {
      required: true,
      message: "请选择员工",
      trigger: ["input", "blur"]
    }
  ],
  reimburseType: [
    {
      required: true,
      message: "类型",
      trigger: ["input", "blur"]
    },
  ],
  reimburseBz: [
    {
      required: true,
      message: "原因",
      trigger: ["input", "blur"]
    },
  ],
  reimburseStatus: [
    {
      required: true,
      message: "状态",
      trigger: ["input", "blur"]
    }
  ],
  reimburseNoAgreen: [
    {
      required: false,
    }
  ]
};

function init() {
  let allconfig = store.state.allConfigStore.configInfo
  const RS = store.state.reimburseStore.reimburseStatus
  const allEmployeeData = store.state.empStore.allEmployeeData
  if (route.params.id) {
    getReimburseById(route.params.id).then(res => {
      modelRef.value = {...res.data.item}
      modelRef.value.reimburseType = allconfig.get(res.data.item.reimburseTypeId).configName
      modelRef.value.reimburseStatus = RS.get(res.data.item.reimburseStatus)
      let emp = allEmployeeData.get(parseInt(res.data.item.reimburseUserNo))
      modelRef.value.reimburseUser = emp.empNo+" "+emp.empName
      for (const re of allEmp) {
        console.log(re)
      }
      if (res.data.item.reimburseStatus===3||res.data.item.reimburseStatus===4){
        isShow.value=true
        updateDisabled.value=true
      }
    })

  } else {

    nextTick(() => {
      modelRef.value.reimburseId = null
      modelRef.value.reimburseNo = null
      modelRef.value.reimburseUser = null
      modelRef.value.reimburseType = null
      modelRef.value.reimburseNoAgreen = null
      modelRef.value.reimburseStatus = null
      modelRef.value.reimburseBz = null
      updateDisabled.value=false
      isShow.value=false
    })

  }
}

onMounted(() => {
  init()
})
//当路由发生改变时，重新加载
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
        updateReimburse(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error(res.message)
          }
        })
      } else {
        saveReimburse(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error(res.message)
          }
        })
      }
      if (modelRef.value.reimburseStatus==="同意"||modelRef.value.reimburseStatus==="驳回"){
        isShow.value=true
      }else {
        isShow.value= false
      }
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}

</script>