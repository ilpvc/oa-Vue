<template>
  <n-space vertical>
    <n-table striped size="medium">
      <thead>
      <tr>
        <th>班级编号</th>
        <th>班名</th>
        <th>班主任</th>
        <th>教室位置</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="clazz in classInfo" :key="clazz.classId">
        <td>{{ clazz.classNo }}</td>
        <td>{{ clazz.className }}</td>
        <td>{{ allEmpName.get(parseInt(clazz.classUser)) }}</td>
        <td>{{ clazz.classAddress }}</td>
        <td>

          <router-link :to="{
            name:'updateClass',
            params:{
              id:clazz.classId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="deleteClazz(clazz.classId)">
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
import {delClazz, pageClazz} from "@/api/class/class";
import {useStore} from "vuex";
import {getStudentByClassId} from "@/api/student/student";

const store = useStore()
const dialog = useDialog()
const message = useMessage()

let classInfo = ref([])
let pageInfo = ref({
  current: 0,
  pages: 0,
})

const allEmpName = store.state.empStore.allEmpNameMap

//页面初始化
function init() {
  pageClazz(1, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    classInfo.value = res.data.items.records
  })
}

//获取和更新页面
function updatePage(pageNo) {
  classInfo.value.length = 0
  pageClazz(pageNo, 6).then(res => {
    let items = res.data.items
    pageInfo.value.current = items.current
    pageInfo.value.pages = items.pages
    classInfo.value = res.data.items.records
  })
}

//删除班级
async function deleteClazz(id) {
  let msg = ""
  await getStudentByClassId(id).then(res => {
    if (!res.data.isEmpty) {
      msg = `该班级下还有${res.data.item.length}名学生， `
    }
  })
  dialog.warning({
    title: '警告',
    content: `${msg}确认删除这个班级吗?`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {

      await delClazz(id).then(res => {
        console.log(res)
        if (res.code === 200) {
          message.success('删除成功')
        } else {
          message.error('删除失败')
        }
      })
      await updatePage(1)
      await store.dispatch('classStore/setClass')
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
