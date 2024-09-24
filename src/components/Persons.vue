<script>
import { billSplitterStore } from '@/store';

export default {
  data() {
    return {
      showDialog: false,
      newPerson: "",
      newPersonGroups: "",
      personTableHeader: ["Name", "Groups", "Expenses", "Balance"],
    }
  },
  methods: {
    addPerson() {
      const store = billSplitterStore();
      this.showDialog = false;
      store.addPerson({"name": this.newPerson, "groups": this.newPersonGroups, "expenses": "0", "balance": "0"});
      this.newPerson = "";
      this.newPersonGroups = "";
      
    },    
    cancelAddingPerson() {
      this.showDialog = false;
      this.newPerson = "";
      this.newPersonGroups = "";
    }
  },
  computed: {
    getPersons() {
      const store = billSplitterStore();
      return store.getPersons;
    }
  }
}
</script>

<template>
  <router-link to="/groups">Groups</router-link>
  <div id="addPersonDialog" v-show="showDialog">
    <label for="name" type="text">Name</label>
    <input id="name"  v-model="newPerson">
    <label for="groups">Groups</label>
    <input id="groups" v-model="newPersonGroups">
    <div id="addPersonButton" class="button" v-show="this.newPerson" @click="addPerson()">Add person</div>
    <div id="cancelButton" class="button" v-show="this.newPerson" @click="cancelAddingPerson()">Cancel</div>
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
      <div>  {{ el.groups }} </div> 
      <div>  {{ el.expenses }} </div> 
      <div>  {{ el.balance }} </div> 
    </template>
  </div>
</template>

<style scoped>
#personList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

#addPerson {
  height: 5vw;
  width: 5vw;
}

#addPersonDialog {
  box-shadow: rgba(244, 230, 230, 0.826) 0px 3px 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.button {
  text-align: center;
  padding: 11px;
  margin-top: 5px;
  background-color: grey;
}
</style>
