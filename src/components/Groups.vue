<template>
    <nav>
        <router-link to="/persons">Persons</router-link>
    </nav>
    <div id="addGroupDialog">
        <label for="newGroupInput">Group Name</label>
        <input id="newGroupInput" v-model="newGroup">
        <div @click="this.addGroup()">Add Group</div>
    </div>
    <div id="groupList">
        <template v-for="el in this.getGroups" :key="el">
            <div>{{ el }}</div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';

export default {
  data() {
    return {
        newGroup: "",
    }
  },
  methods: {
    addGroup() {
        const store = billSplitterStore();
        if (this.newGroup != "") {
            store.addGroup(this.newGroup);
            this.newGroup = "";
        }
    }
  },
  computed: {
    getGroups() {
        const store = billSplitterStore();
        return store.getGroups;
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