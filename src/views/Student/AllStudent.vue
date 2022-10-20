<template>
  <n-space vertical>
    <n-table striped size="medium">
      <thead>
      <tr>
        <th>编号</th>
        <th>姓名</th>
        <th>所在班级</th>
        <th>性别</th>
        <th>邮箱</th>
        <th>电话</th>
        <th>入学时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="student in studentInfo" :key="student.stuId">
        <td>{{ student.stuNo}}</td>
        <td>{{ student.stuName }}</td>
        <td>{{ allClassName.get(student.stuClassId)}}</td>
        <td>{{ student.stuSex }}</td>
        <td>{{ student.stuEmail }}</td>
        <td>{{ student.stuPhone }}</td>
        <td>{{ moment(student.stuEntryTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
        <td>

          <router-link :to="{
            name:'updateStudent',
            params:{
              id:student.stuId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="deleteStudent(student.stuId)">
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
import {delStudent, pageStudent} from "@/api/student/student";
import {useStore} from "vuex";
import moment from "moment";

const store = useStore()
const dialog = useDialog()
const message = useMessage()
const allClassName = store.state.classStore.allClassName
let studentInfo = ref([])
let pageInfo = ref({
  current: 0,
  pages: 0,
})

//页面初始化
function init() {
  pageStudent(1, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    studentInfo.value = res.data.items.records
  })
}

//获取和更新页面
function updatePage(pageNo) {
  studentInfo.value.length = 0
  pageStudent(pageNo, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    studentInfo.value = res.data.items.records
  })
}

//删除员工
function deleteStudent(id) {
  dialog.warning({
    title: '警告',
    content: '确认删除这个学生吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick:async () => {
      await delStudent(id).then(res => {
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
