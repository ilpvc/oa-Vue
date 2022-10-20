<template>
  <n-space vertical>
    <n-table striped>
      <thead>
      <tr>
        <th>编号</th>
        <th>请求人</th>
        <th>报销类型</th>
        <th>报销事由</th>
        <th>申请状态</th>
        <th>(同意/驳回)原因</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="reimburse in reimburseInfo" :key="reimburse.reimburseId">
        <td>{{ reimburse.reimburseNo }}</td>
        <td>{{ reimburse.reimburseUser }}</td>
        <td>{{ reimburse.reimburseType }}</td>
        <td>
          <n-popover trigger="hover">
            <template #trigger>
              <n-a >详情</n-a>
            </template>
            <span>{{ reimburse.reimburseBz ||"无" }}</span>
          </n-popover>
        </td>
        <td>{{ reimburse.reimburseStatus }}</td>
        <td>
          <n-popover trigger="hover">
            <template #trigger>
              <n-a >详情</n-a>
            </template>
            <span>{{ reimburse.reimburseNoAgreen ||"无" }}</span>
          </n-popover>
        </td>
        <td>

          <router-link :to="{
            name:'updateReimburse',
            params:{
              id:reimburse.reimburseId
            }}">
            <n-button type="warning" style="margin-right: 20px">
              修改
            </n-button>
          </router-link>

          <n-button type="error" @click="delDept(reimburse.reimburseId)">
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
import {onMounted, reactive, ref} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {useStore} from "vuex";
import {deleteReimburse, pageReimburse} from "@/api/reimburse/reimburse";

const store = useStore()
const iDialog = useDialog()
const iMessage = useMessage()


let reimburseInfo = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

//初始化,进行分页查询
function init(pNo){
  let pageNo=1
  if (pNo){
    pageNo=pNo
  }
  const RT = store.state.reimburseStore.reimburseTypes
  const RS = store.state.reimburseStore.reimburseStatus
  let allconfig = store.state.allConfigStore.configInfo
  let allEmployeeData = store.state.empStore.allEmployeeData
  //分页查询用户表
  pageReimburse(pageNo, 6).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    for (let item of items.records){
      let reimburse = {
        reimburseId:null,
        reimburseNo:null,
        reimburseUser:null,
        reimburseType:null,
        reimburseBz:null,
        reimburseStatus:null,
        reimburseNoAgreen:null
      }
      reimburse.reimburseId = item.reimburseId
      reimburse.reimburseNo = item.reimburseNo
      let emp = allEmployeeData.get(parseInt(item.reimburseUserNo))
      if (emp!==undefined){
        reimburse.reimburseUser =emp.empName
      }
      reimburse.reimburseType = allconfig.get(item.reimburseTypeId).configName
      reimburse.reimburseBz = item.reimburseBz
      reimburse.reimburseStatus = RS.get(item.reimburseStatus)
      reimburse.reimburseNoAgreen=item.reimburseNoAgreen
      reimburseInfo.push(reimburse)
    }

  })
}

//点击页数重新发起请求
function updatePage(pageNo) {
  reimburseInfo.length = 0
  init(pageNo)
}

//根据id删除部门
function delDept(id) {
  iDialog.warning({
    title: '警告',
    content: '确认删除这个报销记录吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick:async () => {
      await deleteReimburse(id).then(res => {
        console.log(res)
      })
      iMessage.success('删除成功')
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
