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
        :editPersonGroups="editPersonGroups"
        @edit-person="editPersonComplete"
        @edit-person-cancel="cancelEditingPerson">
    </EditPerson>
    
    <div class="grid grid-cols-1 place-items-center">
        <div class="w-3xl">
            <button class="py-2 px-3 bg-lime-200 rounded  ml-0 justify-start" @click="showDialog = true">
                <span><img src="@/assets/add_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"></span> <span>Add Person</span>
            </button>
        </div>
        <template v-for="el in this.getPersons" :key="el">
            <div class="grid grid-cols-5 hover:shadow-md hover:inset-shadow-sm py-2 px-3 rounded w-3xl items-center justify-center">
                <div> {{ el.name }} </div>
                <div>
                    <template v-for="group in el.groups" :key="group">
                        <div class="group border-solid outline-2 outline-gray-300 m-2 p-1 py-2 px-3 rounded"> {{ group.name }} </div>
                    </template>
                </div> 
                <div>  {{ "Expenses: " + el.expenses }} </div> 
                <div>  {{ "Balance: " + el.balance }} </div>
                <div class="grid grid-cols-2 gap-1 place-items-center">
                    <button @click="editPerson(el)">
                        <img src="@/assets/edit_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="edit">
                    </button>
                    <button class="button removePerson" @click="removePerson(el)">
                        <img src="@/assets/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="delete">
                    </button>
                </div>
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
      editPersonGroups: new Map(),
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
        for (const group of this.getGroups) {
            this.editPersonGroups.set(group.name, false);
            for (const personGroup of this.editPersonObj.groups) {
                if (personGroup.name == group.name) {
                    this.editPersonGroups.set(group.name, true);
                }
            }
        }
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
</style>
