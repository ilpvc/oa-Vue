<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules" :disabled="route.params.id&&updateDisabled">
    <n-form-item v-show="route.params.id" path="holidayNo" label="编号">
      <n-input v-model:value="modelRef.holidayNo" @keydown.enter.prevent
               placeholder="请输入编号" :disabled="true"/>
    </n-form-item>
    <n-form-item path="holidayUserNo" label="申请人">
      <n-select v-model:value="modelRef.holidayUserNo"
                placeholder="申请人"
                :options="allEmp"
                :disabled="route.params.id!==undefined"/>
    </n-form-item>
    <n-form-item path="holidayTypeId" label="类型">
      <n-select v-model:value="modelRef.holidayTypeId"
                placeholder="选择请假类型"
                :options="allType"/>
    </n-form-item>
    <n-form-item path="holidayBz" label="请假原因">
      <n-input v-model:value="modelRef.holidayBz" @keydown.enter.prevent
               placeholder="请输入请假原因"/>
    </n-form-item>
    <n-form-item label="请假时间" path="holidayTime">
      <n-date-picker v-model:value="modelRef.holidayTime" type="datetimerange"
                     start-placeholder="开始时间" end-placeholder="结束时间" clearable/>
    </n-form-item>
    <n-form-item path="holidayStatus" label="状态">
      <n-select
          v-model:value="modelRef.holidayStatus"
          :options="allStatus"
          placeholder="申请状态" :disabled="route.params.id&&updateDisabled"/>
    </n-form-item>
    <n-form-item v-show="route.params.id&&updateDisabled"
                 path="holidayNoAgreen" label="(同意/驳回)原因">
      <n-input v-model:value="modelRef.holidayNoAgreen" @keydown.enter.prevent
               :disabled="route.params.id&&updateDisabled"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.holidayTypeId === null||
              modelRef.holidayBz===null||
              modelRef.holidayStatus===null||
              modelRef.holidayTime===null||
              modelRef.holidayUserNo===null"
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
import {getHolidayById, saveHoliday, updateHoliday} from "@/api/Holiday/Holiday";
import moment from "moment";

const route = useRoute()
const dialog = useDialog()
const message = useMessage()
const store = useStore()

const modelRef = ref({
  holidayNo: null,
  holidayUserNo: null,
  holidayTypeId: null,
  holidayBz: null,
  holidayTime: null,
  holidayStartTime: null,
  holidayEndTime: null,
  holidayStatus: null,
  holidayNoAgreen: null
});

const rules = {
  holidayNo: [
    {
      required: true,
      message: "请输入编号",
      trigger: ["input", "blur"]
    }
  ],
  holidayUserNo: [
    {
      required: true,
      message: "请输入批准人",
      trigger: ["input", "blur"]
    }
  ],
  holidayBz: [
    {
      required: true,
      message: "请输入性别",
      trigger: ["input", "blur"]
    },
  ],
  holidayTime: [
    {
      required: true,
    },
  ],
  holidayStatus: [
    {
      required: true,
    }
  ],
  holidayNoAgreen: [
    {
      required: true,
      message: "请输入电话号码"
    }
  ]
};

//更新和保存操作
function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick: () => {
      if (route.params.id) {
        updateHoliday(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        saveHoliday(modelRef.value).then(res => {
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

//所有可以选择的员工和员工号
let allEmp = [...store.state.empStore.allEmpNoAndName].map(v => ({
  label: v,
  value: v
}))

//用于选择的所有报销类型
let allType = [...getAllReimburseType()].map(v => ({
  label: v,
  value: v
}))
//用于选择的所有报销状态
let allStatus = [...getAllReimburseStatus().slice(0, 2)].map((v) => ({
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
  let holidayConfig = []
  for (const [key, config] of allConfig) {
    if (config.configType === "请假") {
      holidayConfig.push(config.configName)
    }
  }
  return holidayConfig
}
//控制状态的是否禁用
let updateDisabled = ref(false)
function init() {
  const allConfig = store.state.allConfigStore.configNameMap
  const status = store.state.reimburseStore.reimburseStatus
  const empNoAndNameMap = store.state.empStore.allEmpNoAndNameMap
  if (route.params.id) {
    getHolidayById(route.params.id).then(res => {
      let item = res.data.item
      modelRef.value = {...item}
      modelRef.value.holidayStatus = status.get(item.holidayStatus)
      modelRef.value.holidayTypeId = allConfig.get(item.holidayTypeId)
      modelRef.value.holidayUserNo = empNoAndNameMap.get(parseInt(item.holidayUserNo))
      modelRef.value.holidayTime = ref([
        parseInt(moment(item.holidayStartTime).format("x")),
        parseInt(moment(item.holidayEndTime).format('x'))
      ])
      if (item.holidayStatus===3||item.holidayStatus===4){
        updateDisabled.value=true
      }
    })

  } else {

    nextTick(() => {
      modelRef.value.holidayId = null
      modelRef.value.holidayNo = null
      modelRef.value.holidayUserNo = null
      modelRef.value.holidayBz = null
      modelRef.value.holidayStartTime = null
      modelRef.value.holidayEndTime = null
      modelRef.value.holidayStatus = null
      modelRef.value.holidayNoAgreen = null
      modelRef.value.holidayTypeId = null

    })
  }
}

onMounted(() => {
  init()
})

watch(() => route.path, () => {
  init()
})


</script>
