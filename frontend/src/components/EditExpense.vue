<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div class="text-center text-2xl mb-4">Edit Expense</div>
            <div class="grid grid-cols-2 gap-2 mt-2 mb-2">
                <label for="personName">Person Name</label>
                <select name="personName" v-model="editExpenseObj.person_name">
                    <template v-for="person in this.getPersons" :key="person">
                        <option> {{ person.name }} </option>
                    </template>
                </select>
                <label for="groupName">Group Name</label>
                <select name="groupName" v-model="editExpenseObj.group_name">
                    <template v-for="group in this.getGroupsOfPerson()" :key="group">
                        <option> {{ group.name }} </option>
                    </template>
                </select>
                <label for="description">Description</label>
                <input id="description" class="border-black bg-gray-200 rounded-md text-center" v-model="editExpenseObj.description">
                <label for="amount">Amount</label>
                <input id="amount" class="border-black bg-gray-200 rounded-md text-center" v-model="editExpenseObj.amount">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="bg-lime-200" @click="updateExpense()">Edit Expense</button>
                <button class="bg-lime-200" @click="cancel()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import NavItem from './NavItem.vue';

export default {
    data() {
        return {
            expensesListCaption: ["Person", "Group", "Description", "Amount"],
            showAddExpenseDialog: false,
            showExpenseDetails: false,
        }
    },
    emits: ["edit-expense", "add-person-cancel"],
    props: ["editExpenseObj"],
    methods: {
        cancel() {
            this.showAddExpenseDialog = false;
            this.$emit("add-person-cancel");
        },
        getGroupsOfPerson() {
            for (let person of this.getPersons) {
                if (person.name == this.editExpenseObj.person_name) {
                    return person.groups;
                }
            }
        },
        updateExpense() {
            const store = billSplitterStore();
            store.editExpense(this.editExpenseObj);
            this.$emit("edit-expense");
        },
    },
    computed: {
        getExpenses() {
            const store = billSplitterStore();
            return store.getExpenses;
        },
        getPersons() {
            const store = billSplitterStore();
            return store.getPersons;
        },
        getGroups() {
            const store = billSplitterStore();
            return store.getGroups;
        },
    }
}
</script>