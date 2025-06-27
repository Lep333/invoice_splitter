<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div class="text-center text-2xl mb-4">Edit Person</div>
            <div class="grid grid-cols-2 gap-2">
                <label for="name" type="text">Name</label>
                <input id="name" class="border-black bg-gray-200 rounded-md text-center" v-model="editPersonObj.name">
            </div>
                <div class="grid grid-cols-1 gap-2 justify-items-center m-2">
                    <template v-for="[group, index] of editPersonGroups.entries()" :key="group">
                        <div v-if="!index">
                            <button class="line-through bg-gray-200 object-center" @click="setMembership(group)">{{ group }}</button>
                        </div>
                        <div v-else>
                            <button class="bg-cyan-300" @click="setMembership(group)">{{ group }}</button>
                        </div>
                    </template>
                </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="bg-lime-200" @click="editPersonComplete()">Edit Person</button>
                <button class="bg-lime-200" @click="cancelEditingPerson()">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      newPersonGroups: new Map(),
    }
  },
  props: ["editPersonObj", "groups", "editPersonGroups"],
  emits: ["edit-person", "edit-person-cancel"],
  methods: {
    editPersonComplete() {
        let personGroups = [];
        for (const [group, bool] of this.editPersonGroups.entries()) {
            if (bool) {
                personGroups.push({
                    "person_name": this.editPersonObj.name,
                    "group_name": group
                });
            }
        }
        this.editPersonObj.groups = personGroups;
        this.$emit('edit-person', {name: this.editPersonObj.name}, personGroups);
        this.newPersonGroups = new Map();
    },
    cancelEditingPerson() {
        this.newPersonGroups = new Map();
        this.$emit('edit-person-cancel');
    },
    setMembership(index) {
        this.editPersonGroups.set(index, !this.editPersonGroups.get(index));
    },
  },
}
</script>

<style scoped>
#editPersonDialog {
    padding: .8vw;
    box-shadow: rgb(19, 48, 110) 0px 3px 8px;
    position: absolute;
    top: 30vh;
    border-radius: 5px;
}

#editPersonDialogGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#editPersonDialogHeader {
    text-align: center;
    font-size: large;
    margin: 1vh;
}
</style>
