<template>
    <div class="grid grid-cols-1 place-items-center">
        <div @click="this.showExpenseDetails = !this.showExpenseDetails" class="flex flex-row w-3xl border border-solid border-black rounded-t">
            <div class="text-4xl flex items-center gap-2">
                <img class="w-7 h-7" v-if="this.showExpenseDetails" src="@/assets/arrow_drop_down_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="show details">
                <img class="w-7 h-7" v-else src="@/assets/arrow_drop_up_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="collapse details">
                Expenses
            </div>
            <div class="ml-auto">
                <div class="grid grid-cols-2 gap-2">
                    <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row" @click="showAddExpenseDialog = true">
                        <img src="@/assets/add_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                        Add Expense
                    </button>
                    <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row" v-if="final_billing_available()" @click="doFinalBilling()">
                        <img src="@/assets/check_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                        Do Final Billing
                    </button>
                    <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row" @click="undoFinalBilling()" v-else>
                        <img src="@/assets/arrow_back_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                        Undo Final Billing
                    </button>
                    <div>
                        <label for="csv_upload" class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row">
                            <img src="@/assets/arrow_back_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">Import CSV
                        </label>
                        <input id="csv_upload" class="hidden" type="file" v-on:change="setFile" refs="csv">
                    </div>
                    <button class="py-2 px-3 bg-lime-200 rounded ml-0 flex flex-row" @click="downloadCSV()">
                        <img src="@/assets/arrow_back_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg">
                        Export CSV
                    </button>
                </div>
            </div>
        </div>
        <AddExpense 
            @add-person="showAddExpenseDialog = false"
            @add-person-cancel="cancel"
            v-show="showAddExpenseDialog">
        </AddExpense>
        <EditExpense
            :editExpenseObj="editExpenseObj"
            @edit-expense="showEditExpenseDialog = false"
            @add-person-cancel="cancelEdit"
            v-show="showEditExpenseDialog">
        </EditExpense>
        <div class="w-3xl border-b border-r border-l border-solid border-black rounded-b">
            <template v-for="el in this.getExpenses" :key="el">
                <div v-if="el.compensation_payment && el.amount > 0" class="flex flex-row m-2 p-1 gap-2 border border-cyan-200 bg-cyan-50 rounded justify-center">
                    <div> {{ el.person_name }} </div>
                    <div><img src="@/assets/arrow_right_alt_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"></div>
                    <div> {{ el.description }} </div>
                    <div> {{ el.amount + " €" }} </div>
                </div>
                <div class="grid grid-cols-5 hover:bg-lime-200 m-2" v-else-if="!el.compensation_payment">
                    <div> {{ el.person_name }} </div>
                    <div> {{ el.group_name }} </div>
                    <div> {{ el.description }} </div>
                    <div> {{ el.amount }} </div>
                    <div>
                        <button @click="openEditDialog(el)">
                            <img src="@/assets/edit_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="edit">
                        </button>
                        <button @click="removeExpense(el)">
                            <img src="@/assets/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="delete">
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { billSplitterStore } from '@/store';
import AddExpense from './AddExpense.vue';
import EditExpense from './EditExpense.vue';
import { ref } from 'vue'

export default {
    data() {
        return {
            personName: "",
            groupName: "",
            description: "",
            amount: "",
            expensesListCaption: ["Person", "Group", "Description", "Amount"],
            showAddExpenseDialog: false,
            showEditExpenseDialog: false,
            editExpenseObj: "",
            showExpenseDetails: false,
            importFile: ref(null),
        }
    },
    components: {
        AddExpense,
        EditExpense,
    },
    methods: {
        addExpense() {
            this.showAddExpenseDialog = false;
            const store = billSplitterStore();
            let expense = { 
                person_name: this.personName,
                group_name: this.groupName,
                description: this.description,
                amount: parseFloat(this.amount)
            };
            store.addExpense(expense);
            this.cancel();
        },
        cancel() {
            this.showAddExpenseDialog = false;
            this.personName = "";
            this.groupName = "";
            this.description = "";
            this.amount = "";
        },
        getGroupsOfPerson() {
            for (let person of this.getPersons) {
                if (person.name == this.personName) {
                    return person.groups;
                }
            }
        },
        doFinalBilling() {
            const store = billSplitterStore();
            return store.doFinalBilling();
        },
        undoFinalBilling() {
            const store = billSplitterStore();
            return store.undoFinalBilling();
        },
        removeExpense(el) {
            const store = billSplitterStore();
            return store.removeExpense(el);
        },
        final_billing_available() {
            let final_billing = true;
            for (let expense of this.getExpenses) {
                if (expense.compensation_payment) {
                    final_billing = false;
                    break;
                }
            }
            return final_billing;
        },
        setFile(event) {
            const store = billSplitterStore();
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                this.importFile = selectedFile;
            
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    const rows = text.trim().split("\n");
                    for (let row of rows) {
                        let expense = row.split(",");
                        let obj = { 
                            person_name: expense[0],
                            group_name: "",
                            description: expense[2],
                            amount: parseFloat(expense[3]),
                        };
                        store.addExpense(obj);
                    }
                }
                reader.readAsText(this.importFile);
            }
        },
        downloadCSV() {
            let csv = "person,group,description,amount\n";
            for (let expense of this.getExpenses) {
                csv += `${expense.person_name},${expense.group_name},${expense.description},${expense.amount}\n`
            }
            const anchor = document.createElement('a');
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            anchor.target = '_blank';
            anchor.download = 'billsplitter.csv';
            anchor.click();
        },
        openEditDialog(el) {
            let expense = {
                ...el,
            };
            this.editExpenseObj = expense;
            this.showEditExpenseDialog = true;
        },
        cancelEdit() {
            this.editExpenseObj = "";
            this.showEditExpenseDialog = false;
        },
    },
    computed: {
        getExpenses() {
            const store = billSplitterStore();
            return store.getExpenses;
        },
        getPersons() {
            const store = billSplitterStore();
            return store.getPersons;
        },
        getGroups() {
            const store = billSplitterStore();
            return store.getGroups;
        },
    }
}
</script>

<style scoped>
#expensesView {
    display: grid;
    grid-template-rows: 1fr 1fr;
}

#addExpenseDialog {
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: absolute;
    top: 30vh;
}

#expensesList {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>