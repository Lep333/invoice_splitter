<template>
    <nav>
        <span id="appName">bill$plitter</span>
        <span class="navItem" :class="{ active: parentName == 'persons' }" @click="this.$router.push('/persons')">Persons</span>
        <span class="navItem" :class="{ active: parentName == 'groups' }" @click="this.$router.push('/groups')">Groups</span>
        <span class="navItem" :class="{ active: parentName == 'expenses' }" @click="this.$router.push('/expenses')">Expenses</span>
    </nav>
</template>

<script>
export default {
  props: ["parentName"],
}
</script>

<style>
nav {
    margin-bottom: 1vh;
}
#appName {
    font-size: x-large;
    padding-right: 10px;
}

.navItem {
    padding-right: 10px;
}

.active {
    font-style: oblique;
    text-decoration: underline blue;
}
</style>