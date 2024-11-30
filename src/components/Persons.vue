<template>
  <router-link to="/groups">Groups</router-link>
  <router-link to="/expenses">Expenses</router-link>
  <div id="addPersonDialog" v-show="showDialog">
    <label for="name" type="text">Name</label>
    <input id="name"  v-model="newPerson">
    <template v-for="(group, index) in this.getGroups" :key="group">
      <input id="groupName" type="checkbox" v-model="newPersonGroups[index]">
      <label for="groupName"> {{ group.groupName }} </label>
    </template>
    <div id="addPersonButton" class="button" v-show="showDialog" @click="addPerson()">Add person</div>
    <div id="cancelButton" class="button" v-show="showDialog" @click="cancelAddingPerson()">Cancel</div>
  </div>
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
  <div>
    <img @click="showDialog = true" id="addPerson" src="../assets/person_add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="add person">
  </div>
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
      <div class="editButton" @click="editPerson(el)"> edit </div>
      <div class="removeButton" @click="removePerson(el)"> remove  </div>
    </template>
  </div>
</template>

<script>
import { billSplitterStore } from '@/store';

export default {
  data() {
    return {
      showDialog: false,
      newPerson: "",
      newPersonGroups: [],
      personTableHeader: ["Name", "Groups", "Expenses", "Balance", "", ""],
      showEditDialog: false,
      editPersonObj: {name: ""},
      editOldName: "",
    }
  },
  methods: {
    addPerson() {
      const store = billSplitterStore();
      this.showDialog = false;
      let personGroups = [];
      for (let i = 0; i < this.getGroups.length; i++) {
        if (this.newPersonGroups[i]) {
          personGroups.push(this.getGroups[i].groupName);
        }
      }
      store.addPerson({name: this.newPerson, groups: personGroups, expenses: 0.0, balance: 0.0});
      this.newPerson = "";
      this.newPersonGroups = [];
      
    },    
    cancelAddingPerson() {
      this.showDialog = false;
      this.newPerson = "";
      this.newPersonGroups = "";
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
}

#addPerson {
  height: 5vw;
  width: 5vw;
}

#addPersonDialog {
  box-shadow: rgba(244, 230, 230, 0.826) 0px 3px 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  top: 30vh;
}

.group {
  margin: 5px;
  padding: 3px;
  background-color: green;
  border-radius: 5px;
}
</style>
