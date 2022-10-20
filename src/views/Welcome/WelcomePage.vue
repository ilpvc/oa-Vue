<template>
  <div class="main">
    <n-h2>欢迎使用本OA管理系统</n-h2>
  </div>

  <div style="overflow: auto">
    <n-timeline horizontal>
      <n-timeline-item content="啊" />
      <n-timeline-item
          type="success"
          title="成功"
          content="哪里成功"
          time="2018-04-03 20:46"
      />
      <n-timeline-item
          type="error"
          content="哪里失败"
          time="2018-04-03 20:46"
      />
      <n-timeline-item
          type="warning"
          title="警告"
          content="哪里警告"
          time="2018-04-03 20:46"
      />
      <n-timeline-item
          type="info"
          title="信息"
          content="是的"
          time="2018-04-03 20:46"
      />
    </n-timeline>
  </div>

</template>

<script setup>

</script>

<style scoped>
.main {
  display: flex;
  justify-content: center;
}
</style>