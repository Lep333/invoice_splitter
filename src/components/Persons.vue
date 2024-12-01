<template>
    <NavItem parentName="persons"></NavItem>
    <AddPerson
        v-show="showDialog"
        :groups="getGroups"
        @add-person="addPerson"
        @add-person-cancel="showDialog = false">
    </AddPerson>
    <div id="editPersonDialog" v-show="showEditDialog">
        <label for="name" type="text">Name</label>
        <input id="name"  v-model="editPersonObj.name">
        <template v-for="(group, index) in this.getGroups" :key="group">
            <input :id="group.groupName" type="checkbox" v-model="newPersonGroups[index]">
            <label :for="group.groupName"> {{ group.groupName }} </label>
        </template>
        <div id="editPersonButton" class="button" @click="editPersonComplete()">Edit person</div>
        <div id="cancelEditButton" class="button" @click="cancelEditingPerson()">Cancel</div>
    </div>
    <span class="button" @click="showDialog = true">Add Person</span>
    <div id="personList">
    <template v-for="el in this.personTableHeader" :key="el">
        <div> {{ el }} </div>
    </template>
    <template v-for="el in this.getPersons" :key="el">
        <div> {{ el.name }} </div>
        <div> 
            <template v-for="group in el.groups" :key="group">
            <span class="group"> {{ group }} </span>
            </template>
        </div> 
        <div>  {{ el.expenses }} </div> 
        <div>  {{ el.balance }} </div>
        <div>
            <span class="button" @click="editPerson(el)"> edit </span>
            <span class="button" @click="removePerson(el)"> remove  </span>
        </div>
    </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import NavItem from './NavItem.vue';
import AddPerson from './AddPerson.vue';

export default {
  data() {
    return {
      showDialog: false,
      newPersonGroups: [],
      personTableHeader: ["Name", "Groups", "Expenses", "Balance", ""],
      showEditDialog: false,
      editPersonObj: {name: ""},
      editOldName: "",
    }
  },
  components: {
    NavItem,
    AddPerson,
  },
  methods: {
    addPerson(person) {
        const store = billSplitterStore();
        this.showDialog = false;
        store.addPerson(person);
    },
    getSumOfOwnExpenses(personName) {
        let sum = 0.0;
        for (let expense of this.getExpenses) {
            if (personName == expense.personName) {
                sum += expense.amount;
            }
        }
        return sum;
    },
    getBalance(person) {
        let balance = 0;
        for (let group of person.groups) {
            let partenGroup = null;
            for (let _group of this.getGroups) {
                if (group == _group.groupName) {
                    partenGroup = _group;
                }
            }
            let sum = 0;
            for (let expense of this.getExpenses) {
                if (expense.groupName == group) {
                    sum += expense.amount;
                }
            }
            let expense = this.getSumOfOwnExpenses(person.name);
            balance += expense - sum / partenGroup.members.length;
        }
        return balance;
    },
    editPerson(person) {
        this.editPersonObj = person;
        this.editOldName = person.name;
        this.showEditDialog = true;
    },
    editPersonComplete() {
        const store = billSplitterStore();
        let personGroups = [];
        for (let i = 0; i < this.getGroups.length; i++) {
                if (this.newPersonGroups[i]) {
                    personGroups.push(this.getGroups[i].groupName);
                }
        }
        this.editPersonObj.groups = personGroups;
        store.editPerson(this.editPersonObj);
        this.editPersonObj = {name: ""};
        this.newPersonGroups = [];
        this.showEditDialog = false;
    },
    cancelEditingPerson() {
        this.editPersonObj = {name: ""};
        this.newPersonGroups = [];
        this.showEditDialog = false;
    },
    removePerson(person) {
        const store = billSplitterStore();
        store.removePerson(person);
    },
  },
  computed: {
    getPersons() {
        const store = billSplitterStore();
        return store.getPersons;
    },
    getGroups() {
        const store = billSplitterStore();
        return store.getGroups;
    },
    getExpenses() {
        const store = billSplitterStore();
        return store.getExpenses;
    },
  }
}
</script>

<style scoped>
#personList {
    margin-top: 2vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.group {
    margin: 5px;
    padding: 3px;
    background-color: green;
    border-radius: 5px;
}
</style>
