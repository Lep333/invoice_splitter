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
        async fetchAll() {
            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };
            let persons = await fetch(`http://localhost:8000/persons/`, requestOptions);
            this.persons = await persons.json();
            let groups = await fetch(`http://localhost:8000/groups/`, requestOptions);
            this.groups = await groups.json();
            let expenses = await fetch(`http://localhost:8000/expenses/`, requestOptions);
            this.expenses = await expenses.json();
        },
        async addPerson(newPerson, personGroups) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    person: { name: newPerson.name },
                    person_groups: personGroups,
                })
            };
            await fetch("http://localhost:8000/persons/", requestOptions);
            await this.fetchAll();
        },
        async addGroup(newGroup) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newGroup.groupName })
            };
            fetch("http://localhost:8000/groups/", requestOptions);
            await this.fetchAll();
        },
        async addExpense(newExpense) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newExpense,
                })
            };
            await fetch("http://localhost:8000/expenses/", requestOptions);
            await this.fetchAll();
        },
        async editPerson(editPerson, personGroups, personName) {
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    person: { name: editPerson.name },
                    person_groups: personGroups,
                })
            };
            await fetch(`http://localhost:8000/persons/${personName}`, requestOptions);
            await this.fetchAll();
        },
        async editGroup(groupNameNew, personGroups, groupName) {
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group: { name: groupNameNew },
                    person_groups: personGroups,
                })
            };
            await fetch(`http://localhost:8000/groups/${groupName}`, requestOptions);
            await this.fetchAll();
        },
        async removePerson(person) {
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            await fetch(`http://localhost:8000/persons/${person.name}`, requestOptions);
            await this.fetchAll();
        },
        async removeGroup(group) {
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            await fetch(`http://localhost:8000/groups/${group.name}`, requestOptions);
            await this.fetchAll();
        },
        async removeExpense(expense) {
            const requestOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            await fetch(`http://localhost:8000/expenses/${expense.id}`, requestOptions);
            await this.fetchAll();
        },
        async doFinalBilling() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            await fetch(`http://localhost:8000/final_billing`, requestOptions);
            await this.fetchAll();
        },
        async undoFinalBilling() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            await fetch(`http://localhost:8000/undo_final_billing`, requestOptions);
            await this.fetchAll();
        }
    }
})