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
        async editPerson(editPerson, personGroups, personName) {
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    person: { name: editPerson.name },
                    person_groups: personGroups,
                })
            };
            let response = await fetch(`http://localhost:8000/persons/${personName}`, requestOptions);
            let data = await response.json();
            this.persons = data;
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
            let response = await fetch(`http://localhost:8000/groups/${groupName}`, requestOptions);
            let data = await response.json();
            this.persons = data;
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
        async doFinalBilling() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            };
            let response = await fetch(`http://localhost:8000/final_billing`, requestOptions);
            let data = await response.json();
            this.persons = data;
        },
    }
})