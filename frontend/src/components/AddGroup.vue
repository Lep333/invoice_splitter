<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div class="text-center text-2xl mb-4">Add Group</div>
            <div class="grid grid-cols-2 gap-2 m-2">
                <label for="newGroupInput">Group Name</label>
                <input class="border-black bg-gray-200 rounded-md text-center" v-model="groupName">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <button class="bg-lime-200" @click="this.$emit('add-group', this.groupName)">Add Group</button>
                <button class="bg-lime-200" @click="this.$emit('add-group-cancel')">Cancel</button>
            </div>
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