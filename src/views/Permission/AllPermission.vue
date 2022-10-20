<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>角色</th>
        <th>拥有权限</th>
        <th>创建时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="permission in Info" :key="permission.permissionsId">
        <td>{{ getRoleName(permission.permissionsRoleId) }}</td>
        <td>{{ getMenuName(permission.permissionsMenuId) }}</td>
        <td>{{moment(permission.createTime).format("YYYY-MM-DD HH:mm:ss")}}</td>
        <td>

          <router-link :to="{
            name:'updatePermission',
            params:{
              id:permission.permissionsId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delDept(permission.permissionsId)">
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
import {onMounted, reactive} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {deletePermission, pagePermission} from "@/api/permission/permission";
import {useStore} from "vuex";
import moment from "moment";


const store = useStore()
let Info = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

let iDialog = useDialog()
let iMessage = useMessage()
let roles = store.state.roleStore.roles
let menu = store.state.menuStore.menu

async function init() {
  //分页查询部门表
  let res = await pagePermission(1, 6)
  let items = res.data.items
  pageDeptInfo.current = items.current
  pageDeptInfo.pages = items.pages
  //查询的部门详细数组
  Info.push(...items.records)
}


//点击页数重新发起请求
function updatePage(pageNo) {
  Info.length = 0
  pagePermission(pageNo, 6).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    Info.push(...items.records)
  })
}

//根据id删除部门
function delDept(id) {
  iDialog.warning({
    title: '警告',
    content: '确认删除这个授权吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      iMessage.success('删除成功')
      await deletePermission(id).then(res => {
        console.log(res)
      })
      await updatePage(1)
    },
    onNegativeClick: () => {
      iMessage.error('删除失败')
    }
  })
}

function getRoleName(id){
  return roles.get(id)
}

function getMenuName(id){
  if (menu.get(id)){
    return menu.get(id).menuName
  }else {
    return ""
  }

}

onMounted(() => {
  init()
})


</script>

<style scoped>

</style>