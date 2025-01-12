<script setup lang="ts">
const props = defineProps(['text'])
</script>

<template>
  <div class="toast text-bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header text-bg-warning">
      <strong class="me-auto">Notification</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-black">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>

</style>