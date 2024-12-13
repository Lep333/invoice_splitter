<template>
    <div id="editPersonDialog">
        <div id="editPersonDialogHeader">Edit Person</div>
        <div id="editPersonDialogGrid">
            <label for="name" type="text">Name</label>
            <input id="name"  v-model="editPersonObj.name">
            <template v-for="(group, index) in this.groups" :key="group">
                <input :id="group.groupName" type="checkbox" v-model="newPersonGroups[index]">
                <label :for="group.groupName"> {{ group.groupName }} </label>
            </template>
            <span id="editPersonButton" class="button" @click="editPersonComplete()">Edit Person</span>
            <span id="cancelEditButton" class="button" @click="cancelEditingPerson()">Cancel</span>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      newPersonGroups: [],
    }
  },
  props: ["editPersonObj", "groups"],
  emits: ["edit-person", "edit-person-cancel"],
  methods: {
    editPersonComplete() {
        let personGroups = [];
        for (let i = 0; i < this.groups.length; i++) {
                if (this.newPersonGroups[i]) {
                    personGroups.push(this.groups[i].groupName);
                }
        }
        this.editPersonObj.groups = personGroups;
        this.$emit('edit-person', {name: this.editPersonObj.name, groups: personGroups});
        this.test = "";
    },
    cancelEditingPerson() {
        this.newPersonGroups = [];
        this.$emit('edit-person-cancel');
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
