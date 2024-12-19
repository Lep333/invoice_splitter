<template>
    <NavItem parentName="groups"></NavItem>
    <span class="button" @click="this.showAddGroupDialog = true">Add Group</span>
    <AddGroup
        v-show="this.showAddGroupDialog"
        @add-group="addGroup"
        @add-group-cancel="this.showAddGroupDialog = false">
    </AddGroup>
    <EditGroup
        v-show="this.showEditGroupDialog"
        :editGroupObj="currentEditGroup"
        @edit-group="editGroup"
        @edit-group-cancel="this.showEditGroupDialog = false">
    </EditGroup>
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
            <div>
                <span class="button" @click="openEditDialog(el)"> edit </span>
            </div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import NavItem from './NavItem.vue';
import AddGroup from './AddGroup.vue';
import EditGroup from './EditGroup.vue';

export default {
  data() {
    return {
        currentEditGroup: { groupName: ""},
        oldGroup: "",
        groupsListCaptions: ["Name", "Members", "Expenses", ""],
        editGroupCaptions: ["Name", "Share", "Amount"],
        showAddGroupDialog: false,
        showEditGroupDialog: false,
    }
  },
  components: {
    NavItem,
    AddGroup,
    EditGroup,
  },
  methods: {
    addGroup(groupName) {
        const store = billSplitterStore();
        if (groupName != "") {
            let group = {
                groupName: groupName,
                members: [],
                expenses: 0,
            }
            store.addGroup(group);
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
        this.oldGroup = el;
        this.currentEditGroup = JSON.parse(JSON.stringify(el));;
        this.showEditGroupDialog = true;
    },
    editGroup(editedGroup) {
        this.showEditGroupDialog = false;
        const store = billSplitterStore();
        for (let member of this.currentEditGroup.members) {
            member.share = parseFloat(member.share);
        }
        store.editGroup(editedGroup, this.oldGroup);
        this.currentEditGroup = { groupName: ""};
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
#groupList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
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