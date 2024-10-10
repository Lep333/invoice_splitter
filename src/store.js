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
            for (let groupName of newPerson.groups) {
                for (let group of this.groups) {
                    if (groupName == group.groupName) {
                        group.members.push(newPerson.name);
                    }
                }
            }
        },
        addGroup(newGroup) {
            this.groups.push(newGroup);
        },
        addExpense(newExpense) {
            this.expenses.push(newExpense);
            for (let group of this.groups) {
                if (group.groupName == newExpense.groupName) {
                    group.expenses += newExpense.amount;
                }
            }
            for (let person of this.persons) {
                if (person.name == newExpense.personName) {
                    person.expenses += newExpense.amount; 
                }
                let balance = 0;
                for (let groupName of person.groups) {
                    for (let group of this.groups) {
                        if (groupName == group.groupName) {
                            balance += group.expenses / group.members.length;
                        }
                    }
                }
                person.balance = person.expenses - balance;
            }
        },
        doFinalBilling() {
            let personNames = [];
            for (let person of this.persons) {
                personNames.push(person.name);
            }
            let group = {
                groupName: "FINAL BILLING",
                members: personNames,
                expenses: 0,
            };
            this.addGroup(group);
            let debtors = this.persons.filter((el) => el.balance < 0);
            let creditors = this.persons.filter((el) => el.balance > 0);
            for (let debtor of debtors) {
                let balance = -debtor.balance;
                for (let creditor of creditors) {
                    if (debtor.balance > -0.1) {
                        break;
                    }
                    if (creditor.balance > 0.1) {
                        let amount = Math.min(balance, creditor.balance);
                        balance -= amount;
                        let expense = { 
                            personName: debtor.name,
                            groupName: "FINAL BILLING",
                            description: `pays ${creditor.name}`,
                            amount: amount,
                        };
                        let expense2 = { 
                            personName: creditor.name,
                            groupName: "FINAL BILLING",
                            description: `gets payed by ${debtor.name}`,
                            amount: -amount,
                        };
                        this.addExpense(expense);
                        this.addExpense(expense2);
                    }
                }
            }
        }
    }
})