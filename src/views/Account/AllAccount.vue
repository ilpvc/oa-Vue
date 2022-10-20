<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>用户名</th>
        <th>用户状态</th>
        <th>用户角色</th>
        <th>用户员工号</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in userInfo" :key="user.userId">
        <td>{{ user.userAccount }}</td>
        <td>{{ user.userStatus }}</td>
        <td>{{ user.userRole }}</td>
        <td>{{ user.userEmpNo }}</td>
        <td>

          <router-link :to="{
            name:'updateAccount',
            params:{
              id:user.userId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delDept(user.userId)">
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
import {deleteUser, pageUser} from "@/api/account/account";
import {useStore} from "vuex";

const store = useStore()

let userInfo = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

let iDialog = useDialog()
let iMessage = useMessage()


let roles = store.state.roleStore.roles

function init(pNo){
  let pageNo=1
  if (pNo){
    pageNo=pNo
  }
  //分页查询用户表
  pageUser(pageNo, 6).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    for (let item of items.records){
      let user = {
        userId:null,
        userAccount:null,
        userStatus:null,
        userRole:null,
        userEmpNo:null
      }
      user.userId = item.userId
      user.userAccount = item.userAccount
      user.userEmpNo = item.userEmpNo
      user.userRole = roles.get(item.userRoleId)
      user.userStatus =
          checkUserStatus(item)
      userInfo.push(user)
    }

  })
}



//查询用户状态
function checkUserStatus(item){
  if (item.userStatus===0){
    return "正常"
  }
  if(item.userStatus===1){
    return "禁用"
  }
  if (item.userStatus===2){
    return "删除"
  }
}

//点击页数重新发起请求
function updatePage(pageNo) {
  userInfo.length = 0
  init(pageNo)
}

//根据id删除用户
function delDept(id) {
  iDialog.warning({
    title: '警告',
    content: '确认删除这个用户吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick:async () => {
      iMessage.success('删除成功')
      await deleteUser(id).then(res => {
        console.log(res)
      })
      await updatePage(1)
    },
    onNegativeClick: () => {
      iMessage.error('删除失败')
    }
  })
}




onMounted(()=>{
  init() //初始化分页查询
})
</script>

<style scoped>

</style>