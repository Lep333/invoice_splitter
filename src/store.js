import { defineStore } from "pinia";

function groupInPerson(person, group) {
    for (let g of person.groups) {
        if (g == group.groupName) {
            return true;
        }
    }
    return false;
}

function personInGroup(person, group) {
    for (let member of group.members) {
        if (member.person == person) {
            return true;
        }
    }
    return false;
}

function getTotalSumOfGroupShares(group) {
    let totalShares = 0;
    for (let member of group.members) {
        totalShares += member.share;
    }
    return totalShares;
}

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
            let person = {
                person: newPerson,
                share: 1,
            };
            for (let groupName of newPerson.groups) {
                for (let group of this.groups) {
                    if (groupName == group.groupName) {
                        group.members.push(person);
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
        editPerson(editPerson) {
            // change group membership
            let person = {
                person: editPerson,
                share: 1,
            };
            for (let group of this.groups) {
                // add person to group
                if (groupInPerson(editPerson, group) && !personInGroup(editPerson, group)) {
                    group.members.push(person);
                } else if (!groupInPerson(editPerson, group) && personInGroup(editPerson, group)) { // remove person from group 
                    let index = group.members.indexOf(editPerson);
                    group.members.splice(index, 1);
                }
            }

            // change name in expenses
            for (let expense of this.expenses) {
                if (oldName == expense.personName) {
                    expense.personName = person.name;
                }
            }
            updateBalance();
        },
        removePerson(person) {
            for (let group of this.groups) {
                group.members = group.members.filter((el) => el != person.name);
            }

            let personExpenses = this.expenses.filter((el) => el.personName == person.name);
            for (let expense of personExpenses) {
                expense.personName = "";
            }
            this.persons = this.persons.filter((el) => person.name != el.name);
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
        },
        updateBalance() {
            for (let group of this.groups) {
                let groupBalance = 0.0;
                for (let expense of this.expenses) {
                    groupBalance += expense.amount;
                }
                group.expenses = groupBalance;
            }

            for (let person of this.persons) {
                let balance = 0;
                for (let groupName of person.groups) {
                    for (let group of this.groups) {
                        if (groupName == group.groupName) {
                            balance += group.expenses / getTotalSumOfGroupShares(group);
                        }
                    }
                }
                person.balance = person.expenses - balance;
            }
        }
    }
})