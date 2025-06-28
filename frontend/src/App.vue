<script setup>
import { onMounted } from 'vue'
import { billSplitterStore } from '@/store';
import NavItem from './components/NavItem.vue';
import Persons from '@/components/Persons.vue';
import Groups from '@/components/Groups.vue';
import Expenses from './components/Expenses.vue';

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
    <body class="text-gray-900 m-2">
      <NavItem class="m-2"></NavItem>
      <div class="grid grid-cols-1 gap-3">
        <Persons></Persons>
        <Groups></Groups>
        <Expenses></Expenses>
      </div>
    </body>
  </html>
</template>

<style>
</style>