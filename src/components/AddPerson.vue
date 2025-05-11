<template>
    <div id="addPersonDialog">
        <div id="addPersonDialogHeader">Add Person</div>
        <div id="addPersonDialogGrid">
            <label for="name" type="text">Name</label>
            <input id="name"  v-model="newPerson">
            <template v-for="(group, index) in groups" :key="group">
                <input id="groupName" type="checkbox" v-model="newPersonGroups[index]">
                <label for="groupName"> {{ group.name }} </label>
            </template>
            <span id="addPersonButton" class="button" @click="addPerson()">Add Person</span>
            <span id="cancelButton" class="button" @click="cancelAddingPerson()">Cancel</span>
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
    cancelAddingPerson() {
        this.$emit("add-person-cancel");
        this.newPerson = "";
        this.newPersonGroups = "";
    },
  },
}
</script>

<style scoped>
#addPersonDialog {
    padding: .8vw;
    box-shadow: rgb(19, 48, 110) 0px 3px 8px;
    position: absolute;
    top: 30vh;
    border-radius: 5px;
}

#addPersonDialogGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#addPersonDialogHeader {
    text-align: center;
    font-size: large;
    margin: 1vh;
}
</style>