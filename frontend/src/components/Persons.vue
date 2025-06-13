<template>
    <NavItem parentName="persons"></NavItem>
    <AddPerson
        v-show="showDialog"
        :groups="getGroups"
        @add-person="addPerson"
        @add-person-cancel="showDialog = false">
    </AddPerson>
    <EditPerson
        v-show="showEditDialog"
        :groups="getGroups"
        :editPersonObj="editPersonObj"
        @edit-person="editPersonComplete"
        @edit-person-cancel="cancelEditingPerson">
    </EditPerson>
    <span id="openAddPersonForm" class="button" @click="showDialog = true">Add Person</span>
    <div id="personList">
    <template v-for="el in this.personTableHeader" :key="el">
        <div> {{ el }} </div>
    </template>
    <template v-for="el in this.getPersons" :key="el">
        <div> {{ el.name }} </div>
        <div> 
            <template v-for="group in el.groups" :key="group">
            <span class="group"> {{ group.name }} </span>
            </template>
        </div> 
        <div>  {{ el.expenses }} </div> 
        <div>  {{ el.balance }} </div>
        <div>
            <span class="button openEditPersonForm" @click="editPerson(el)"> edit </span>
            <span class="button removePerson" @click="removePerson(el)"> remove  </span>
        </div>
    </template>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import NavItem from './NavItem.vue';
import AddPerson from './AddPerson.vue';
import EditPerson from './EditPerson.vue';

export default {
  data() {
    return {
      showDialog: false,
      showEditDialog: false,
      personTableHeader: ["Name", "Groups", "Expenses", "Balance", ""],
      editPersonObj: {name: ""},
      editOldName: "",
      editPersonOld: "",
    }
  },
  components: {
    NavItem,
    AddPerson,
    EditPerson,
  },
  methods: {
    addPerson(person, personGroups) {
        const store = billSplitterStore();
        this.showDialog = false;
        store.addPerson(person, personGroups);
    },
    editPerson(person) {
        this.editPersonObj = JSON.parse(JSON.stringify(person));
        this.editPersonOld = person;
        this.showEditDialog = true;
    },
    editPersonComplete(person, personGroups) {
        const store = billSplitterStore();
        store.editPerson(person, personGroups, this.editPersonOld.name);
        this.showEditDialog = false;
    },
    cancelEditingPerson() {
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
    }
  },
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
