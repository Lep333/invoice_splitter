<template>
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
        <div class="flex flex-row w-3xl border border-solid border-black rounded-t">
            <div @click="this.showPersonDetails = !this.showPersonDetails" class="text-4xl flex items-center gap-2 hover:bg-gray-200 rounded px-2">
                <img class="w-7 h-7" v-if="this.showPersonDetails" src="@/assets/arrow_drop_down_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="show details">
                <img class="w-7 h-7" v-else src="@/assets/arrow_drop_up_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="collapse details">
                Persons
            </div>
            <div class="ml-auto">
                <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row p-1" @click="showDialog = true">
                    <img src="@/assets/add_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                    Add Person
                </button>
            </div>
        </div>
        <div v-if="this.showPersonDetails" class="w-3xl border-b border-r border-l border-solid border-black rounded-b">
            <template v-for="el in this.getPersons" :key="el">
                <div class="grid grid-cols-5 hover:bg-lime-200 m-2 items-center justify-center rounded">
                    <div> {{ el.name }} </div>
                    <div class="flex flex-row flex-wrap gap-1">
                        <template v-for="group in el.groups" :key="group">
                            <div class="border border-solid p-1 rounded-lg"> {{ group.name }} </div>
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
        <div class="flex flex-row flex-wrap border-b border-r border-l w-3xl rounded-b" v-else>
            <template v-for="el in this.getPersons" :key="el">
                <div class="flex items-center justify-center m-2 py-2 px-3 items-center justify-center rounded-xl gap-2 border text-xs shadow-md">
                    <span> {{ el.name }} </span>
                    <span>  {{ el.balance }} </span>
                </div>
            </template>
        </div>
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
      showPersonDetails: false,
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
