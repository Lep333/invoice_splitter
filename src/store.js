import { defineStore } from "pinia";

export const billSplitterStore = defineStore('billSplitter', {
    state: () => ({ persons: [], groups: [], expenses: [], }),
    getters: {
        getPersons: (state) => state.persons,
        getGroups: (state) => state.groups,
        getExpenses: (state) => state.expenses,
    },
    actions: {
        addPerson(newPerson) {
            this.persons.push(newPerson);
        },
        addGroup(newGroup) {
            this.groups.push(newGroup);
        },
        addExpense(newExpense) {
            this.expenses.push(newExpense);
        },
    }
})