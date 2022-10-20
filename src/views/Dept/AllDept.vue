<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>部门编号</th>
        <th>部门名称</th>
        <th>部门负责人</th>
        <th>部门位置</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="dept in deptInfo" :key="dept.deptId">
        <td>{{ dept.deptNo }}</td>
        <td>{{ dept.deptName }}</td>
        <td>{{ empNameMap.get(parseInt(dept.deptUser)) }}</td>
        <td>{{ dept.deptAddress }}</td>
        <td>

          <router-link :to="{
            name:'updateDept',
            params:{
              id:dept.deptId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delDept(dept.deptId)">
            删除
          </n-button>
        </td>
      </tr>
      </tbody>
    </n-table>
  </n-space>
  <div style="display: flex;justify-content: center;margin-top: 10px">
    <n-pagination v-model:page="pageDeptInfo.current"
                  :page-count="pageDeptInfo.pages"
                  @update:page="updatePage"/>
  </div>


</template>
<script setup>
import {deleteDept, pageDept} from "@/api/dept/dept";
import { reactive} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {useStore} from "vuex";
import {getEmployeeByCondition} from "@/api/employee/employee";

let store = useStore()
let deptInfo = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

let iDialog = useDialog()
let iMessage = useMessage()

const empNameMap = store.state.empStore.allEmpNameMap
//分页查询部门表
pageDept(1, 6).then(res => {
  let items = res.data.items
  pageDeptInfo.current = items.current
  pageDeptInfo.pages = items.pages
  //查询的部门详细数组
  deptInfo.push(...items.records)
})

//点击页数重新发起请求
function updatePage(pageNo) {
  deptInfo.length = 0
  pageDept(pageNo, 6).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    deptInfo.push(...items.records)
  })
}

//根据id删除部门
async function delDept(id) {
  let length ="";
  await getEmployeeByCondition({empDeptId:id}).then(res=>{
    length = "该部门还有"+res.data.items.length+"名员工,"
  })
  iDialog.warning({
    title: '警告',
    content: `${length}确认删除这个部门吗?`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteDept(id).then(res => {
          if (res.code === 200) {
            iMessage.success('删除成功')
          } else {
            iMessage.error(res.message)
          }
        }
      )
      await store.dispatch('deptStore/setDepts')
      updatePage(1)
    },
    onNegativeClick: () => {
      iMessage.error('取消')
    }
  })
}


</script>

<style scoped>

</style>