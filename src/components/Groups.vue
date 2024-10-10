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
            <div>{{ el.groupName }}</div>
            <div>{{ el.members }}</div>
            <div>{{ el.expenses }}</div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';

export default {
  data() {
    return {
        newGroup: "",
        groupsListCaptions: ["Name", "Members", "Expenses"],
    }
  },
  methods: {
    addGroup() {
        const store = billSplitterStore();
        if (this.newGroup != "") {
            let group = {
                groupName: this.newGroup,
                members: [],
                expenses: 0,
            }
            store.addGroup(group);
            this.newGroup = "";
        }
    },
    getExpensesOfGroup(groupName) {
        let expenses = this.getExpenses;
        let sum = 0.0;
        for (let expense of expenses) {
            if (expense.groupName == groupName.groupName) {
                sum += expense.amount;
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
    grid-template-columns: 1fr 1fr 1fr;
}
</style>