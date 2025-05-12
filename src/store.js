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

function updateBalance(groups, persons, expenses) {
    for (let group of groups) {
        let groupBalance = 0.0;
        for (let expense of expenses) {
            groupBalance += expense.amount;
        }
        group.expenses = groupBalance;
    }

    for (let person of persons) {
        let balance = 0;
        for (let groupName of person.groups) {
            for (let group of groups) {
                let mySharesOfGroup = group.members.filter((el) => el.person.name == person.name)[0].share;
                if (groupName == group.groupName) {
                    balance += mySharesOfGroup * group.expenses / getTotalSumOfGroupShares(group);
                }
            }
        }
        person.balance = person.expenses - balance;
    }
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
        async addPerson(newPerson, personGroups) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    person: { name: newPerson.name },
                    person_groups: personGroups,
                })
            };
            let response = await fetch("http://localhost:8000/persons/", requestOptions);
            let data = await response.json();
            this.persons = data;
        },
        async addGroup(newGroup) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newGroup.groupName })
            };
            let response = await fetch("http://localhost:8000/groups/", requestOptions);
            let data = await response.json();
            this.groups = data;
        },
        async addExpense(newExpense) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newExpense,
                })
            };
            let response = await fetch("http://localhost:8000/expenses/", requestOptions);
            let data = await response.json();
            this.expenses = data;
        },
        editPerson(editPerson, oldPerson) {
            for (let person of this.persons) {
                if (person.name == oldPerson.name) {
                    person.name = editPerson.name;
                    person.groups = editPerson.groups;
                    break;
                }
            }

            // change group membership
            let person = {
                person: editPerson,
                share: 1,
            };
            for (let group of this.groups) {
                if (groupInPerson(editPerson, group) && !personInGroup(oldPerson, group)) {
                    // add person to group
                    group.members.push(person);
                } else if (!groupInPerson(editPerson, group) && personInGroup(oldPerson, group)) {
                    // remove person from group 
                    let index = group.members.indexOf(editPerson);
                    group.members.splice(index, 1);
                }
            }

            updateBalance(this.groups, this.persons, this.expenses);
        },
        editGroup(editedGroup, oldGroup) {
            console.log("hier");
            for (let person of oldGroup.members) {
                console.log(oldGroup);
                let i = 0;
                for (let group of person.person.groups) {
                    console.log(group);
                    if (group == oldGroup.groupName) {
                        console.log("CHANGE");
                        person.person.groups[i] = editedGroup.groupName;
                    }
                    i++;
                }
            }
            
            for (let key in editedGroup) {
                oldGroup[key] = editedGroup[key];
            }



            updateBalance(this.groups, this.persons, this.expenses);
        },
        async removePerson(person) {
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            let response = await fetch(`http://localhost:8000/persons/${person.name}`, requestOptions);
            let data = await response.json();
            this.persons = data;
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
    }
})