<template>
    <NavItem parentName="groups"></NavItem>
    <span class="button" @click="this.showAddGroupDialog = true">Add Group</span>
    <div id="addGroupDialog" v-show="showAddGroupDialog">
        <label for="newGroupInput">Group Name</label>
        <input id="newGroupInput" v-model="newGroup">
        <div class="button" @click="this.addGroup()">Add Group</div>
        <div class="button" @click="showAddGroupDialog = false">Cancel</div>
    </div>
    <div id="editGroupDialog" v-show="showEditGroupDialog">
        <label for="newGroupInput">Group Name</label>
        <input id="newGroupInput" v-model="currentEditGroup.groupName">
        <div id="personGrid">
            <template v-for="caption in this.editGroupCaptions">
                <div>{{ caption }}</div>
            </template>
            <template v-for="el in this.currentEditGroup.members">
                <div>{{ el.name }}</div>
                <input type="number" v-model="el.share">
                <div>{{ this.currentEditGroup.expenses * el.share / getSharesSum(this.currentEditGroup) }}</div>
            </template>
        </div>
        <div class="button" @click="this.editGroup()">Edit Group</div>
    </div>
    <div id="groupList">
        <template v-for="el in this.groupsListCaptions" :key="el">
            <div> {{ el }} </div>
        </template>
        <template v-for="el in this.getGroups" :key="el">
            <div>{{ el.groupName }}</div>
            <div>
                <template v-for="person in el.members">
                    <span class="person">{{ person.person.name }}</span>
                </template>
            </div>
            <div>{{ el.expenses }}</div>
            <div @click="openEditDialog(el)"> edit </div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import NavItem from './NavItem.vue';

export default {
  data() {
    return {
        newGroup: "",
        currentEditGroup: { groupName: ""},
        groupsListCaptions: ["Name", "Members", "Expenses", ""],
        editGroupCaptions: ["Name", "Share", "Amount"],
        showAddGroupDialog: false,
        showEditGroupDialog: false,
    }
  },
  components: {
    NavItem,
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
            this.showAddGroupDialog = false;
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
    },
    openEditDialog(el) {
        this.currentEditGroup = el;
        this.showEditGroupDialog = true;
    },
    editGroup() {
        this.showEditGroupDialog = false;
        const store = billSplitterStore();
        for (let member of this.currentEditGroup.members) {
            member.share = parseFloat(member.share);
        }
        this.currentEditGroup = { groupName: ""};
        store.updateBalance();
    },
    getSharesSum(el) {
        console.log(el.expenses);
        let sum = 0;
        for (let member of el.members) {
            sum += member.share;
        }
        return sum;
    },
    test(el) {
        return el.expenses / getSharesSum(this.currentEditGroup);
    },
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
    box-shadow: rgba(244, 230, 230, 0.826) 0px 3px 8px;
    position: relative;
    top: 30vh;
}

#groupList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}

#editGroupDialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#personGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.person {
  margin: 5px;
  padding: 3px;
  background-color: green;
  border-radius: 5px;
}
</style>