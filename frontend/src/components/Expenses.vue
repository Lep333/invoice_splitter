<template>
    <NavItem parentName="expenses"></NavItem>
    <span class="button" @click="showAddExpenseDialog = true">Add Expense</span>
    <span class="button" @click="doFinalBilling()">Do Final Billing</span>
    <div id="expensesView">
        <div id="addExpenseDialog" v-show="showAddExpenseDialog">
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
            <input id="description" v-model="description">
            <label for="amount">Amount</label>
            <input id="amount" v-model="amount">
            <div class="button" @click="addExpense()">Add Expense</div>
            <div class="button" @click="cancel()">Cancel</div>
        </div>
        <div id="expensesList">
            <template v-for="caption in this.expensesListCaption" :key="caption">
                <div> {{ caption }} </div>
            </template>
            <template v-for="el in this.getExpenses" :key="el">
                <div> {{ el.person_name }} </div>
                <div> {{ el.group_name }} </div>
                <div> {{ el.description }} </div>
                <div> {{ el.amount }} </div>
            </template>
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
        }
    },
    components: {
        NavItem,
    },
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
        },
        cancel() {
            this.showAddExpenseDialog = false;
            this.personName = "";
            this.groupName = "";
            this.description = "";
            this.amount = "";
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

<style scoped>
#expensesView {
    display: grid;
    grid-template-rows: 1fr 1fr;
}

#addExpenseDialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: absolute;
    top: 30vh;
}

#expensesList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>