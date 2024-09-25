<template>
    <nav>
        <router-link to="/persons">Persons</router-link>
        <router-link to="/expenses">Expenses</router-link>
    </nav>
    <div id="addGroupDialog">
        <label for="newGroupInput">Group Name</label>
        <input id="newGroupInput" v-model="newGroup">
        <div @click="this.addGroup()">Add Group</div>
    </div>
    <div id="groupList">
        <template v-for="el in this.groupsListCaptions" :key="el">
            <div> {{ el }} </div>
        </template>
        <template v-for="el in this.getGroups" :key="el">
            <div>{{ el }}</div>
            <div> {{ this.getExpensesOfGroup(el) }} </div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';

export default {
  data() {
    return {
        newGroup: "",
        groupsListCaptions: ["Name", "Expenses"],
    }
  },
  methods: {
    addGroup() {
        const store = billSplitterStore();
        if (this.newGroup != "") {
            store.addGroup(this.newGroup);
            this.newGroup = "";
        }
    },
    getExpensesOfGroup(groupName) {
        let groups = this.getExpenses;
        let sum = 0.0;
        for (let group of groups) {
            if (group.groupName == groupName) {
                sum += group.amount;
            }
        }
        return sum;
    }
  },
  computed: {
    getGroups() {
        const store = billSplitterStore();
        return store.getGroups;
    },
    getExpenses() {
        const store = billSplitterStore();
        return store.getExpenses;
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
    grid-template-columns: 1fr 1fr;
}
</style>