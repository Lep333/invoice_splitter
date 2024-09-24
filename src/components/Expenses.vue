<template>
    <div id="addExpenseDialog">
        <label for="personName">Person Name</label>
        <input id="personName" v-model="personName">
        <label for="groupName">Group Name</label>
        <input id="groupName" v-model="groupName">
        <label for="description">Description</label>
        <input id="description" v-model="description">
        <label for="amount">Amount</label>
        <input id="amount" v-model="amount">
        <div @click="addExpense()">Add Expense</div>
        <div @click="cancel()">Cancel</div>
    </div>
    <div id="expensesList">
        <template v-for="caption in this.expensesListCaption" :key="caption">
            <div> {{ caption }} </div>
        </template>
        <template v-for="el in this.getExpenses" :key="el">
            <div> {{ el.personName }} </div>
            <div> {{ el.groupName }} </div>
            <div> {{ el.description }} </div>
            <div> {{ el.amount }} </div>
        </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';

export default {
    data() {
        return {
            personName: "",
            groupName: "",
            description: "",
            amount: "",
            expensesListCaption: ["Person", "Group", "Description", "Amount"],
        }
    },
    methods: {
        addExpense() {
            const store = billSplitterStore();
            let expense = { 
                personName: this.personName,
                groupName: this.groupName,
                description: this.description,
                amount: parseFloat(this.amount)
            };
            store.addExpense(expense);
            this.cancel();
        },
        cancel() {
            this.personName = "";
            this.groupName = "";
            this.description = "";
            this.amount = "";
        },
    },
    computed: {
        getExpenses() {
            const store = billSplitterStore();
            return store.getExpenses;
        }
    }
}
</script>

<style scoped>
#addExpenseDialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#expensesList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>