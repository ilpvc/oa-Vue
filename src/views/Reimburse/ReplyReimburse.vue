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
        <td>{{ reimburse.reimburseBz }}</td>
        <td>{{ reimburse.reimburseStatus }}</td>
        <td>{{ reimburse.reimburseNoAgreen }}</td>
        <td>
          <n-button type="success" @click="agreeReimburse(reimburse.reimburseId)"
                    style="margin-right: 20px">
            同意
          </n-button>
          <n-button type="warning" @click="rejected(reimburse.reimburseId)">
            驳回
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
  <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="同意"
      positive-text="确认"
      negative-text="取消"
      :rid="model.reimburseId"
      @positive-click="submitCallback(model.reimburseId,model.type)"
      @negative-click="cancelCallback">
    <n-form
        :model="model"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"

        :style="{maxWidth: '640px'}">
      <n-form-item label="(同意/驳回)原因">
        <n-input v-model:value="model.reimburseNoAgreen" placeholder="请输入原因"/>
      </n-form-item>
    </n-form>

  </n-modal>

</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {useDialog, useMessage} from "naive-ui"
import {useStore} from "vuex";
import {
  getReimburseById,
  getReimburseByStatus,
  updateReimburseSimple
} from "@/api/reimburse/reimburse";

const store = useStore()
const iDialog = useDialog()
const iMessage = useMessage()


let reimburseInfo = reactive([])
let pageDeptInfo = reactive({
  pages: 0,
  current: 0,
})

let showModal = ref(false)
let model = ref({
  reimburseNoAgreen: null,
  reimburseId:null,
  type:null
})

//初始化,进行分页查询
function init(pNo) {
  let pageNo = 1
  if (pNo) {
    pageNo = pNo
  }
  const RS = store.state.reimburseStore.reimburseStatus
  let allconfig = store.state.allConfigStore.configInfo
  let allEmployeeData = store.state.empStore.allEmployeeData

  //分页查询用户表
  getReimburseByStatus(pageNo, 6, 2).then(res => {
    let items = res.data.items
    pageDeptInfo.current = items.current
    pageDeptInfo.pages = items.pages
    //查询的部门详细数组
    for (let item of items.records) {
      let reimburse = {
        reimburseId: null,
        reimburseNo: null,
        reimburseUser: null,
        reimburseType: null,
        reimburseBz: null,
        reimburseStatus: null,
        reimburseNoAgreen: null
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
      reimburse.reimburseNoAgreen = item.reimburseNoAgreen
      reimburseInfo.push(reimburse)
    }

  })
}


//点击页数重新发起请求
function updatePage(pageNo) {
  reimburseInfo.length = 0
  init(pageNo)
}



//同意报销
function agreeReimburse(id) {
  showModal.value = true
  model.value.reimburseId=id
  model.value.type=1
}

//驳回报销
function rejected(id){
  showModal.value = true
  model.value.reimburseId=id
  model.value.type=0
}


async function submitCallback(id,type){
  console.log(id)
  let res = await getReimburseById(id)
  if (type===1){
    res.data.item.reimburseStatus=3
  }else{
    res.data.item.reimburseStatus=4
  }
  res.data.item.reimburseNoAgreen=model.value.reimburseNoAgreen
  updateReimburseSimple(res.data.item,id).then(res=>{
    if (res.code===200){
      iMessage.success('成功')
    }else{
      iMessage.error('失败')
    }
    updatePage(1)
  })
}

function cancelCallback(){
  iMessage.error('取消')
}

onMounted(() => {
  init() //初始化分页查询
})
</script>
