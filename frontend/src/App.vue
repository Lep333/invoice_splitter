<script setup>
import { onMounted } from 'vue'
import { billSplitterStore } from '@/store';

const store = billSplitterStore()

onMounted(() => {
  store.fetchAll() // This runs on every page load / refresh
})
</script>

<template>
  <router-view ></router-view>
</template>

<style>
html {
  background-color: rgb(29, 29, 29);
  color: whitesmoke;
}

.button {
  text-align: center;
  padding: .5vh;
  margin-top: 2vh;
  margin-right: .5vh;
  background-color: rgb(19, 48, 110);
  border-radius: 0.3vh;
}
</style>