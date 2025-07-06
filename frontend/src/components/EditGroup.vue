<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
            <div class="text-center text-2xl mb-4">Edit Group</div>
            <div class="grid grid-cols-2 gap-2">
                <label for="newGroupInput">Group Name</label>
                <input class="border-black bg-gray-200 rounded-md text-center" id="newGroupInput" v-model="editGroupObj.name">
            </div>
            <div class="grid grid-cols-3 gap-2">
                <template v-for="caption in this.editGroupCaptions">
                    <div class="mt-2">{{ caption }}</div>
                </template>
                <template v-for="mem in this.editGroupObj.members">
                    <div>{{ mem.person_name }}</div>
                    <input class="border-black bg-gray-200 rounded-md text-center" v-model="mem.share">
                    <div>{{ (this.editGroupObj.expenses * mem.share / getSharesSum(this.editGroupObj)).toFixed(2) + " €" }}</div>
                </template>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
                <button class="bg-lime-200" @click="this.$emit('edit-group', this.editGroupObj)">Edit Group</button>
                <button class="bg-lime-200" @click="this.$emit('edit-group-cancel')">Cancel</button>
            </div>
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
        let sum = 0;
        for (let member of el.members) {
            sum += parseInt(member.share);
        }
        console.log(sum);
        return sum;
    },
  },
};
</script>

<style>
</style>