<script setup>
import { onMounted } from 'vue'
import { billSplitterStore } from '@/store';

const store = billSplitterStore()

onMounted(() => {
  store.fetchAll() // This runs on every page load / refresh
})
</script>

<template>
  <html>
    <head>
      <link href="frontend/src/styles.css" type="text/css" rel="stylesheet">
    </head>
    <body class="text-gray-900">
      <router-view ></router-view>
    </body>
  </html>
</template>

<style>
</style>