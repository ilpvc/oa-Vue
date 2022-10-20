<template>
  <div style="height: 100vh; position: relative">
    <n-layout position="absolute">
      <n-layout-header style="height: 64px; padding: 24px" bordered>
        <IndexHeader></IndexHeader>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
        <!--        <n-layout-sider>-->
        <!--          <IndexNavigation></IndexNavigation>-->
        <!--        </n-layout-sider>-->

        <IndexNavigation></IndexNavigation>
        <n-layout
            bordered
            content-style="padding:16px;">
          <router-view></router-view>
        </n-layout>


      </n-layout>
      <n-layout-footer
          bordered
          position="absolute"
          style="height: 64px; padding: 24px"
          align="center">
        Copyright © 2018-2022 ilpvc All Rights Reserved.
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup>
import IndexHeader from "@/components/IndexHeader/IndexHeader"
import IndexNavigation from "@/components/IndexNavigation/IndexNavigation"
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const router = useRouter()
const store = useStore()


store.dispatch('deptStore/setDepts')
store.dispatch('roleStore/setRoles')
store.dispatch('menuStore/setMenu')
store.dispatch('userStore/setStatusInfo')
store.dispatch('reimburseStore/setReimburseTypes')
store.dispatch('reimburseStore/setReimburseStatus')
store.dispatch('allConfigStore/setConfigInfo')
store.dispatch('empStore/setAllEmpNoAndName')
store.dispatch('classStore/setClass')

router.push({name:'welcome'})

</script>

<style scoped>

</style>

