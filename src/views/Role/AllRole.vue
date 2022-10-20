<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>角色</th>
        <th>创建时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="role in roleInfo" :key="role.roleId">
        <td>{{ role.roleName }}</td>
        <td>{{ moment(role.createTime).format("YYYY-MM-DD HH:mm:ss") }}</td>
        <td>

          <router-link :to="{
            name:'updateRole',
            params:{
              id:role.roleId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delDept(role.roleId)">
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
import {reactive} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {deleteRole, pageRole} from "@/api/role/role";
import moment from "moment";
import {useStore} from "vuex";

const store = useStore()
let roleInfo = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

let iDialog = useDialog()
let iMessage = useMessage()


//分页查询部门表
pageRole(1, 6).then(res => {
  let items = res.data.items
  pageDeptInfo.current = items.current
  pageDeptInfo.pages = items.pages
  //查询的部门详细数组
  roleInfo.push(...items.records)
})

//点击页数重新发起请求
function updatePage(pageNo) {
  roleInfo.length = 0
  pageRole(pageNo, 6).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    roleInfo.push(...items.records)
  })
}

//根据id删除部门
function delDept(id) {
  iDialog.warning({
    title: '警告',
    content: '确认删除这个角色吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {

      await deleteRole(id).then(res => {
        iMessage.success('删除成功')
      })
      await updatePage(1)
      await store.dispatch('roleStore/setRoles')
    },
    onNegativeClick: () => {
      iMessage.error('删除失败')
    }
  })
}


</script>

<style scoped>

</style>