<template>
    <router-link to="/persons">Persons</router-link>
    <div id="addGroupDialog">
        <label for="newGroupInput">Group Name</label>
        <input id="newGroupInput" v-model="newGroup">
        <div @click="this.addGroup()">Add Group</div>
    </div>
    <div id="groupList">
        <template v-for="el in this.groups" :key="el">
            <div>{{ el }}</div>
        </template>
    </div>
</template>

<script>
export default {
  data() {
    return {
        groups: [],
        newGroup: "",
    }
  },
  methods: {
    addGroup() {
        if (this.newGroup != "") {
            this.groups.push(this.newGroup);
            this.newGroup = "";
        }
    }
  },
  name: 'Groups',
};
</script>

<style scoped>
#addGroupDialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#groupList {
    display: grid;
    grid-template-columns: 1fr;
}
</style>