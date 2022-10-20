<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="permissionsRole" label="角色">
      <n-select
          v-model:value="modelRef.permissionsRole"
          placeholder="选择角色"
          :options="allData"/>
    </n-form-item>
    <n-form-item path="permissionsMenuId" label="权限">
      <n-tree-select
          multiple
          checkable
          filterable
          :clear-filter-after-select="false"
          :options="menuData"
          v-model:value="modelRef.permissionsMenu"
          :default-value="[modelRef.permissionsMenu]"
          clearable
          placeholder="选择权限"/>
    </n-form-item>

    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.permissionsRole === null||
              modelRef.permissionsMenu===null"
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
import {nextTick, onMounted, ref, toRaw, watch} from "vue";
import {
  useMessage,
  useDialog
} from "naive-ui";
import {useStore} from "vuex";
import {useRoute} from "vue-router"
import {getPermissionById, getPermissionByRoleId, savePermission, updatePermission} from "@/api/permission/permission";
import {getRoleByName} from "@/api/role/role";

const route = useRoute()
const store = useStore()
const formRef = ref(null);
const message = useMessage();
const dialog = useDialog()

let checkedMenu = ref([])
const modelRef = ref({
  permissionsRole: null,
  permissionsMenu: null
});

const rules = {
  permissionsRole: [
    {
      required: true,
    }
  ],
};

let roles = store.state.roleStore.roles
let menu = store.state.menuStore.menu

function init() {
  if (route.params.id) {
    getPermissionById(route.params.id).then(res => {
      let item = {...res.data.item}
      modelRef.value.permissionsRole = roles.get(item.permissionsRoleId)
      modelRef.value.permissionsMenu = [
        item.permissionsMenuId
      ]
      console.log(modelRef.value.permissionsRole)
    })

  } else {

    nextTick(() => {
      modelRef.value.permissionsRole = null
      modelRef.value.permissionsMenu = null
    })
  }
}

onMounted(() => {
  init()
  menuTree()
})

watch(() => route.path, () => {
  init()
})


function updateAndSave() {
  dialog.info({
    title: '请确认',
    content: '确认要保存?',
    positiveText: "确定",
    negativeText: '取消',
    onPositiveClick: () => {
      message.loading('正在保存')
        savePermission(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error('保存失败')
          }
        })
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}





let allData= store.state.roleStore.allRolesName.map((v)=>({
  label:v,
  value:v
}))

let menuData= ref([])

let listMenu = []
function menuTree(){
  for (const item of menu) {

    if (menu.get(item[1].menuParentId)===undefined){
      let kes = {
        label:item[1].menuName,
        key:item[0],
        parent:item[1].menuParentId,
        children:[]
      }
      menuData.value.push(kes)
    }
  }

  for (const listMenu1 of menu) {
    listMenu.push(toRaw(listMenu1[1]))
  }

  for (const item of menuData.value) {
    let m1 = listMenu.filter(menu=>{
      return menu.menuParentId ===item.key
    })
    for (let menu of m1) {
      let rl= {
        label:null,
        key:null,
        parent:null,
        children:[]
      }
      rl.label = menu.menuName
      rl.key = menu.menuId
      rl.parent = menu.menuParentId
      item.children.push(rl)
    }
    for (const t of item.children) {
      let t1 = listMenu.filter(menu=>{
        return menu.menuParentId ===t.key
      })
      for (let menu of t1) {
        let rl= {
          label:null,
          key:null,
          parent:null,
        }
        rl.label = menu.menuName
        rl.key = menu.menuId
        rl.parent = menu.menuParentId
        t.children.push(rl)
      }
    }
  }
}


//监听角色变化
watch(()=>modelRef.value.permissionsRole,async (newValue)=>{
  //根据选择的角色名获得角色id
  let id = await getRoleByName(newValue).then(res=>{
    let id = res.data.item.roleId
      return id
  })
  let menuId = await getPermissionByRoleId(id).then(res=>{
    let menuId=[]
    for (const item of res.data.items) {
      menuId.push(item.permissionsMenuId)
    }
    return menuId
  })
  modelRef.value.permissionsMenu = menuId
})


</script>