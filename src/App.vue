<template>
  <n-message-provider>
    <n-dialog-provider>
      <router-view/>
    </n-dialog-provider>
  </n-message-provider>

</template>

<script setup>
import {useRouter} from 'vue-router'
import {NDialogProvider,NMessageProvider} from "naive-ui"
import {getToken} from "@/utils/auth";

if (getToken()!==undefined){
  useRouter().push({path:"/"})
}else{
  useRouter().push({path:"/login"})
}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}
</style>
