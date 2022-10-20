<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item v-show="route.params.id" path="deptNo" label="部门编号" >
      <n-input v-model:value="modelRef.deptNo" @keydown.enter.prevent
               placeholder="请输入部门编号" :disabled="route.params.id!==undefined"/>
    </n-form-item>
    <n-form-item path="deptName" label="部门名称">
      <n-input v-model:value="modelRef.deptName" @keydown.enter.prevent
               placeholder="请输入部门名称"/>
    </n-form-item>
    <n-form-item v-show="route.params.id" path="deptUser" label="部门负责人">
      <n-select
          v-model:value="modelRef.deptUser"
          placeholder="选择部门负责人"
          :options="deptUserMap"
          />
    </n-form-item>
    <n-form-item path="deptAddress" label="部门位置">
      <n-input v-model:value="modelRef.deptAddress" @keydown.enter.prevent
               placeholder="请输入部门位置"/>
    </n-form-item>
    <n-form-item :span="5" label="所属部门">
      <n-select
          v-model:value="modelRef.belongDept"
          placeholder="所属部门"
          :options="belongDept"
          :clearable="true"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.deptAddress===null||
              modelRef.deptName===null"
              round
              type="primary"
              @click="updateAndSave">
            提交
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {
  useMessage,
    useDialog
} from "naive-ui";
import {useStore} from "vuex";
import {useRoute} from "vue-router"
import {getDeptById, saveDept, updateDept} from "@/api/dept/dept";

const route = useRoute()
const store = useStore()
const formRef = ref(null);
const message = useMessage();
const dialog=useDialog()

const deptNo =ref(null)
const modelRef = ref({
  deptId:null,
  deptNo: null,
  deptName: null,
  deptAddress: null,
  deptUser: null,
  belongDept:null
});

const rules = {

  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: ["input", "blur"]
    }
  ],
  deptUser: [
    {
      required: true,
      message: "请输入部门负责人",
      trigger: ["input", "blur"]
    },
  ],
  deptPid: [
    {
      required: false,
      message: "请输入所属部门编号",
      trigger: ["input", "blur"]
    },
  ],
  deptAddress: [
    {
      required: true,
      message: "请输入部门地址",
      trigger: ["input", "blur"]
    },
  ]
};


let depts = store.state.deptStore.depts

let allEmpMap = store.state.empStore.allEmployeeData
let empCondition = []
for (const [key,value] of allEmpMap) {

  if (value.empDeptId===parseInt(route.params.id)){
    empCondition.push(value.empNo+" "+value.empName)
  }
}
let deptUserMap =empCondition.map((v)=>({
  label:v,
  value:v
}))

//所属部门选择项
let belongDept = depts.map((v) => ({
  label: v,
  value: v
}))

function init(){
  const deptsMap = store.state.deptStore.deptsMap
  const allEmployeeData = store.state.empStore.allEmployeeData
  if (route.params.id){
    getDeptById(route.params.id).then(res=>{
      modelRef.value = {...res.data.item}
      modelRef.value.belongDept = deptsMap.get(res.data.item.deptPid)
      let emp = allEmployeeData.get(parseInt(res.data.item.deptUser))
      if (emp!==undefined){
        modelRef.value.deptUser =emp.empNo+" "+emp.empName
      }

    })

  }else {

    nextTick(()=>{
      modelRef.value.deptId=null
      modelRef.value.belongDept=null
      modelRef.value.deptNo=null
      modelRef.value.deptName=null
      modelRef.value.deptAddress=null
      modelRef.value.deptUser=null
    })

  }
}

onMounted(()=>{
  init()
})

watch(()=>route.path,()=>{
  init()
})


function updateAndSave(){
  dialog.info({
    title:'请确认',
    content:'确认要保存?',
    positiveText:"确定",
    negativeText:'取消',
    onPositiveClick: async ()=>{
      if (route.params.id){
        let empInfo=[]
        if (modelRef.value.deptUser!==null){
          empInfo = modelRef.value.deptUser.split(" ")
        }
        await updateDept(modelRef.value,route.params.id,empInfo[0]).then(res=>{
          if(res.code===200){
            message.success('更新成功')
          }else{
            message.error('更新失败')
          }
        })
      }else {
        //对数据进行解析
        await saveDept(modelRef.value).then(res=>{
          if(res.code===200){
            message.success('保存成功')
          }else{
            message.error(res.message)
          }
        })
      }
      await store.dispatch('deptStore/setDepts')
    },
    onNegativeClick:()=>{
      message.error('保持失败')
    }
  })
}

</script>