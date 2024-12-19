<template>
    <div id="editGroupDialog">
        <div id="editGroupDialogHeader">Edit Group</div>
        <div class="editGroupDialogGrid">
            <label for="newGroupInput">Group Name</label>
            <input id="newGroupInput" v-model="editGroupObj.groupName">
        </div>
        <div id="editGroupMemberGrid">
            <template v-for="caption in this.editGroupCaptions">
                <div>{{ caption }}</div>
            </template>
            <template v-for="el in this.editGroupObj.members">
                <div>{{ el.person.name }}</div>
                <input type="number" v-model="el.share">
                <div>{{ this.editGroupObj.expenses * el.share / getSharesSum(this.editGroupObj) }}</div>
            </template>
        </div>
        <div class="editGroupDialogGrid">
            <span class="button" @click="this.$emit('edit-group', this.editGroupObj)">Edit Group</span>
            <span class="button" @click="this.$emit('edit-group-cancel')">Cancel</span>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
        groupsListCaptions: ["Name", "Members", "Expenses", ""],
        editGroupCaptions: ["Name", "Share", "Amount"],
    }
  },
  emits: ["edit-group", "edit-group-cancel"],
  props: ["editGroupObj"],
  methods: {
    getSharesSum(el) {
        console.log(el.expenses);
        let sum = 0;
        for (let member of el.members) {
            sum += member.share;
        }
        return sum;
    },
  },
};
</script>

<style>
#editGroupDialog {
    padding: .8vw;
    box-shadow: rgb(19, 48, 110) 0px 3px 8px;
    position: absolute;
    top: 30vh;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
}

.editGroupDialogGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#editGroupMemberGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

#editGroupDialogHeader {
    text-align: center;
    font-size: large;
    margin: 1vh;
}
</style>