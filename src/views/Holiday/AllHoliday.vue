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
              <n-a >详情</n-a>
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
              <n-a >详情</n-a>
            </template>
            <span>{{ holiday.holidayNoAgreen ||"无" }}</span>
          </n-popover>
        </td>
        <td>

          <router-link :to="{
            name:'updateHoliday',
            params:{
              id:holiday.holidayId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="deleteHoliday(holiday.holidayId)">
            删除
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
</template>

<script setup>

import {onMounted, ref} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {delHoliday, pageHoliday} from "@/api/Holiday/Holiday";
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
function init() {
  pageHoliday(1, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    holidayInfo.value = res.data.items.records
  })
}

//获取和更新页面
function updatePage(pageNo) {
  holidayInfo.value.length = 0
  pageHoliday(pageNo, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    holidayInfo.value = res.data.items.records
  })
}

//删除员工
function deleteHoliday(id) {
  dialog.warning({
    title: '警告',
    content: '确认删除这个请假记录吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick:async () => {
      await delHoliday(id).then(res => {
        console.log(res)
        if (res.code === 200) {
          message.success('删除成功')
        } else {
          message.error('删除失败')
        }
      })
      await updatePage(1)
    },
    onNegativeClick: () => {
      message.error('删除失败')
    }
  })
}

//挂载时初始化数据
onMounted(() => {
  init()
})
</script>
