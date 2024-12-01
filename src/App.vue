<script setup>
import Person from './components/Persons.vue'
</script>

<template>
  <router-view ></router-view>
</template>

<style>
html {
  background-color: rgb(29, 29, 29);
  color: whitesmoke;
}

.nav-item {
  padding-left: 1vw;
}

.button {
  text-align: center;
  padding: 11px;
  margin-top: 5px;
  background-color: grey;
}
</style>