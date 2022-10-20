<template>
  <n-space vertical>
    <n-table striped size="medium">
      <thead>
      <tr>
        <th>编号</th>
        <th>申请人</th>
        <th>类型</th>
        <th>请假原因</th>
        <th>开始日期</th>
        <th>结束日期</th>
        <th>状态</th>
        <th>(同意/驳回)原因</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="holiday in holidayInfo" :key="holiday.holidayId">
        <td>{{ holiday.holidayNo }}</td>
        <td>{{ allEmpNameMap.get(parseInt(holiday.holidayUserNo)) }}</td>
        <td>{{ allConfigName.get(holiday.holidayTypeId) }}</td>
        <td>
          <n-popover trigger="hover">
            <template #trigger>
              <n-a>详情</n-a>
            </template>
            <span>{{ holiday.holidayBz }}</span>
          </n-popover>
        </td>
        <td>{{ moment(holiday.holidayStartTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
        <td>{{ moment(holiday.holidayEndTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
        <td>{{ statusMap.get(holiday.holidayStatus) }}</td>
        <td>
          <n-popover trigger="hover">
            <template #trigger>
              <n-a>详情</n-a>
            </template>
            <span>{{ holiday.holidayNoAgree || "无" }}</span>
          </n-popover>
        </td>
        <td>

          <n-button type="warning" style="margin-right: 20px" @click="agree(holiday.holidayId)">
            同意
          </n-button>
          <n-button type="error" @click="rejected(holiday.holidayId)">
            驳回
          </n-button>
        </td>
      </tr>
      </tbody>
    </n-table>
  </n-space>
  <div style="display: flex;justify-content: center;margin-top: 10px">
    <n-pagination v-model:page="pageInfo.current"
                  :page-count="pageInfo.pages"
                  @update:page="updatePage"/>
  </div>

  <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="(同意/驳回)"
      positive-text="确认"
      negative-text="取消"
      :rid="model.holidayId"
      @positive-click="submitCallback(model.holidayId,model.type)"
      @negative-click="cancelCallback">
    <n-form
        :model="model"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"

        :style="{maxWidth: '640px'}">
      <n-form-item label="(同意/驳回)原因">
        <n-input v-model:value="model.holidayNoAgreen" placeholder="请输入原因"/>
      </n-form-item>
    </n-form>

  </n-modal>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {
  getHolidayByCondition,
  getHolidayById,
  updateHolidaySimple
} from "@/api/Holiday/Holiday";
import {useStore} from "vuex";
import moment from "moment";

const store = useStore()
const dialog = useDialog()
const message = useMessage()

let holidayInfo = ref([])
let pageInfo = ref({
  current: 0,
  pages: 0,
})

//员工姓名
const allEmpNameMap = store.state.empStore.allEmpNameMap
//请假类型
const allConfigName = store.state.allConfigStore.configNameMap
//请假状态
let statusMap = new Map
statusMap.set(1, "草稿")
statusMap.set(2, '提交')
statusMap.set(3, '同意')
statusMap.set(4, "驳回")

//页面初始化
function init (pNo) {
  let pageNo = 1
  if (pNo) {
    pageNo = pNo
  }
  let queryHoliday = {
    holidayStatus:2
  }
  getHolidayByCondition(pageNo, 6,queryHoliday).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    holidayInfo.value = res.data.items.records
  })
}

//获取和更新页面
function updatePage(pageNo) {
  holidayInfo.value.length = 0
  init(pageNo)
}


let showModal = ref(false)
let model = ref({
  holidayNoAgreen: null,
  holidayId:null,
  type:null
})
//同意报销
function agree(id) {
  showModal.value = true
  model.value.holidayId=id
  model.value.type=1
}

//驳回报销
function rejected(id){
  showModal.value = true
  model.value.holidayId=id
  model.value.type=0
}


async function submitCallback(id,type){
  let res = await getHolidayById(id)
  if (type===1){
    res.data.item.holidayStatus=3
  }else{
    res.data.item.holidayStatus=4
  }
  res.data.item.holidayNoAgreen=model.value.holidayNoAgreen
  updateHolidaySimple(res.data.item,id).then(res=>{
    if (res.code===200){
      message.success('成功')
    }else{
      message.error('失败')
    }
    updatePage(1)
  })
}

function cancelCallback(){
  message.error('取消')
}

//挂载时初始化数据
onMounted(() => {
  init()
})
</script>
