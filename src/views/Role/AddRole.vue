<template>
  <n-form ref="formRef" :model="modelRef" :rules="rules">
    <n-form-item path="roleName" label="角色名称">
      <n-input v-model:value="modelRef.roleName" @keydown.enter.prevent
               placeholder="请输入角色名称"/>
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
              :disabled="modelRef.roleName === null"
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
import {getRoleById, saveRole, updateRole} from "@/api/role/role";

const route = useRoute()
const store = useStore()
const formRef = ref(null);
const message = useMessage();
const dialog = useDialog()

const modelRef = ref({
  roleName: null,
});

const rules = {
  roleName: [
    {
      required: true,
      message: "请填入角色名称",
      trigger: ["input", "blur"]
    }
  ],

};


function init() {
  if (route.params.id) {
    getRoleById(route.params.id).then(res => {
      modelRef.value = {...res.data.item}
    })

  } else {

    nextTick(() => {
      modelRef.value.roleName = null

    })
  }
}

onMounted(() => {
  init()
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
    onPositiveClick: async () => {
      if (route.params.id) {
        await updateRole(modelRef.value, route.params.id).then(res => {
          if (res.code === 200) {
            message.success('更新成功')
          } else {
            message.error('更新失败')
          }
        })
      } else {
        await saveRole(modelRef.value).then(res => {
          if (res.code === 200) {
            message.success('保存成功')
          } else {
            message.error('保存失败')
          }
        })
      }
      await store.dispatch('roleStore/setRoles')
    },
    onNegativeClick: () => {
      message.error('保持失败')
    }
  })
}

</script>