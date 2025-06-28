<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div class="text-center text-2xl mb-4">Add Expense</div>
            <div class="grid grid-cols-2 gap-2 mt-2 mb-2">
                <label for="personName">Person Name</label>
                <select name="personName" v-model="personName">
                    <template v-for="person in this.getPersons" :key="person">
                        <option> {{ person.name }} </option>
                    </template>
                </select>
                <label for="groupName">Group Name</label>
                <select name="groupName" v-model="groupName">
                    <template v-for="group in this.getGroupsOfPerson()" :key="group">
                        <option> {{ group.name }} </option>
                    </template>
                </select>
                <label for="description">Description</label>
                <input id="description" class="border-black bg-gray-200 rounded-md text-center" v-model="description">
                <label for="amount">Amount</label>
                <input id="amount" class="border-black bg-gray-200 rounded-md text-center" v-model="amount">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="bg-lime-200" @click="addExpense()">Add Expense</button>
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
            personName: "",
            groupName: "",
            description: "",
            amount: "",
            expensesListCaption: ["Person", "Group", "Description", "Amount"],
            showAddExpenseDialog: false,
            showExpenseDetails: false,
        }
    },
    emits: ["add-expense", "add-person-cancel"],
    methods: {
        addExpense() {
            this.showAddExpenseDialog = false;
            const store = billSplitterStore();
            let expense = { 
                person_name: this.personName,
                group_name: this.groupName,
                description: this.description,
                amount: parseFloat(this.amount)
            };
            store.addExpense(expense);
            this.cancel();
            this.$emit("add-expense");
        },
        cancel() {
            this.showAddExpenseDialog = false;
            this.personName = "";
            this.groupName = "";
            this.description = "";
            this.amount = "";
            this.$emit("add-person-cancel");
        },
        getGroupsOfPerson() {
            for (let person of this.getPersons) {
                if (person.name == this.personName) {
                    return person.groups;
                }
            }
        },
        doFinalBilling() {
            const store = billSplitterStore();
            return store.doFinalBilling();
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