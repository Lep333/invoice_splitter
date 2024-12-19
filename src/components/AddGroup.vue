<template>
    <div id="addGroupDialog">
        <div id="addGroupDialogHeader">Add Group</div>
        <div id="addGroupDialogGrid">
            <label for="newGroupInput">Group Name</label>
            <input id="newGroupInput" v-model="groupName">
            <span class="button" @click="this.$emit('add-group', this.groupName)">Add Group</span>
            <span class="button" @click="this.$emit('add-group-cancel')">Cancel</span>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
        groupName: "",
    }
  },
  emits: ["add-group", "add-group-cancel"],
}
</script>

<style scoped>
#addGroupDialog {
    padding: .8vw;
    box-shadow: rgb(19, 48, 110) 0px 3px 8px;
    position: absolute;
    top: 30vh;
    border-radius: 5px;
}

#addGroupDialogGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#addGroupDialogHeader {
    text-align: center;
    font-size: large;
    margin: 1vh;
}
</style>