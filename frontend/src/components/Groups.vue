<template>
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
    <div class="grid grid-cols-1 place-items-center">
        <div @click="this.showGroupDetails = !this.showGroupDetails" class="flex flex-row w-3xl border border-solid border-black rounded-t">
            <div class="text-4xl flex items-center gap-2">
                <img class="w-7 h-7" v-if="this.showGroupDetails" src="@/assets/arrow_drop_down_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="show details">
                <img class="w-7 h-7" v-else src="@/assets/arrow_drop_up_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="collapse details">
                Expense Groups
            </div>
            <div class="ml-auto">
                <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row" @click="showAddGroupDialog = true">
                    <img src="@/assets/add_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                    Add Group
                </button>
            </div>
        </div>
        <div v-if="this.showGroupDetails" class="w-3xl border-b border-r border-l border-solid border-black rounded-b">
            <template v-for="el in this.getGroups" :key="el">
                <div class="grid grid-cols-4 hover:shadow-md hover:inset-shadow-sm py-2 px-3 items-center justify-center rounded">
                    <div>{{ el.name }}</div>
                    <div class="flex flex-row">
                        <template v-for="mem in el.members">
                            <div class="group border border-solid m-2 p-1 py-2 px-3 rounded">{{ mem.person_name }}</div>
                        </template>
                    </div>
                    <div>{{ el.expenses }}</div>
                    <div>
                        <button @click="openEditDialog(el)">
                            <img src="@/assets/edit_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="edit">
                        </button>
                    </div>
                </div>
            </template>
        </div>
        <div class="flex flex-row flex-wrap border-b border-r border-l w-3xl rounded-b" v-else>
            <template v-for="el in this.getGroups" :key="el">
                <div class="flex items-center justify-center m-2 py-2 px-3 items-center justify-center rounded-xl gap-2 border text-xs shadow-md">
                    <span> {{ el.name }} </span>
                </div>
            </template>
        </div>
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
        showGroupDetails: false,
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
        for (let member of editedGroup.members) {
            member.share = parseFloat(member.share);
        }
        store.editGroup(editedGroup.name, editedGroup.members, this.oldGroup.name);
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