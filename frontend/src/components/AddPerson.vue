<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div id="addPersonDialog" class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div id="addPersonDialogHeader" class="text-center text-lg">Add Person</div>
            <div>
                <div class="grid grid-cols-2 gap-2">
                    <label for="name" type="text">Name</label>
                    <input id="name" class="border-black bg-gray-200 rounded-md text-center"  v-model="newPerson">
                </div>
                <div class="grid grid-cols-1 gap-2">
                    <template v-for="(group, index) in groups" :key="group">
                        <div v-if="!newPersonGroups[index]">
                            <button class="line-through bg-gray-200 object-center" @click="setMembership(index)">{{ group.name }}</button>
                        </div>
                        <div v-else>
                            <button @click="setMembership(index)">{{ group.name }}</button>
                        </div>
                    </template>
                </div>

            </div>
            <div class="grid grid-cols-2 gap-2">
                <button id="addPersonButton" @click="addPerson()">Add Person</button>
                <button id="cancelButton" @click="cancelAddingPerson()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      newPerson: "",
      newPersonGroups: [],
    }
  },
  props: ["groups"],
  emits: ["add-person", "add-person-cancel"],
  methods: {
    addPerson() {
        let personGroups = [];
        for (let i = 0; i < this.groups.length; i++) {
                if (this.newPersonGroups[i]) {
                    personGroups.push({
                        "person_name": this.newPerson,
                        "group_name": this.groups[i].name
                    });
                }
        }
        let newPersonObj = {id: "", name: this.newPerson};
        this.$emit("add-person", newPersonObj, personGroups);
        this.newPerson = "";
        this.newPersonGroups = [];
    },
    setMembership(index) {
        this.newPersonGroups[index] = !this.newPersonGroups[index];
    },
    cancelAddingPerson() {
        this.$emit("add-person-cancel");
        this.newPerson = "";
        this.newPersonGroups = [];
    },
  },
}
</script>

<style scoped>
</style>