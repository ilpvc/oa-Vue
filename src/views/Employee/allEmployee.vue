<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>编号</th>
        <th>姓名</th>
        <th>性别</th>
        <th>学历</th>
        <th>邮箱</th>
        <th>电话</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="employee in employeeInfo" :key="employee.empId">
        <td>{{ employee.empNo }}</td>
        <td>{{ employee.empName }}</td>
        <td>{{ employee.empSex }}</td>
        <td>{{ employee.empEducation }}</td>
        <td>{{ employee.empEmail }}</td>
        <td>{{ employee.empPhone }}</td>
        <td>

          <router-link :to="{
            name:'updateEmployee',
            params:{
              id:employee.empId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delEmp(employee.empId)">
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

import {delEmployee, pageEmployee} from "@/api/employee/employee";
import {onMounted, ref} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {useStore} from "vuex";

const store = useStore()
const dialog = useDialog()
const message = useMessage()

let employeeInfo = ref([])
let pageInfo = ref({
  current: 0,
  pages: 0,
})


//页面初始化
function init() {
  pageEmployee(1, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    employeeInfo.value = res.data.items.records
  })
}

//获取和更新页面
function updatePage(pageNo) {
  employeeInfo.value.length = 0
  pageEmployee(pageNo, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    employeeInfo.value = res.data.items.records
  })
}

//删除员工
function delEmp(id) {
  dialog.warning({
    title: '警告',
    content: '确认删除这个员工吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick:async () => {

      await delEmployee(id).then(res => {
        if (res.code === 200) {
          message.success('删除成功')
          store.dispatch('empStore/setAllEmpNoAndName')
        } else {
          message.error('删除失败')
        }
      })
      await updatePage(1)
      await store.dispatch('empStore/setAllEmpNoAndName')
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
