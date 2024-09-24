import { defineStore } from "pinia";

export const billSplitterStore = defineStore('billSplitter', {
    state: () => ({ persons: [], groups: [] }),
    getters: {
        getPersons: (state) => state.persons,
        getGroups: (state) => state.groups,
    },
    actions: {
        addPerson(newPerson) {
            this.persons.push(newPerson);
        },
        addGroup(newGroup) {
            this.groups.push(newGroup);
        }
    }
})