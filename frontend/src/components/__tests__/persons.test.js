import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Persons from "../Persons.vue";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from "pinia/dist/pinia.prod.cjs";
import { billSplitterStore } from '@/store';
import AddPerson from '../AddPerson.vue';
import EditPerson from "../EditPerson.vue";

describe("Persons.vue", () => {
    const wrapper = mount(Persons, {
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        },
    })

    test("add person", async () => {
        let personName = "test";
        const store = billSplitterStore();
        await wrapper.find("#openAddPersonForm").trigger("click");
        store.groups = [{ groupName: "group", members: [], expense: 0 }];
        const addPersonComponent = wrapper.findComponent(AddPerson);
        await nextTick();

        addPersonComponent.vm.newPerson = personName;
        addPersonComponent.vm.newPersonGroups[0] = true;
        await addPersonComponent.find("#addPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(1);
        expect(store.getPersons[0].name).toEqual(personName);
        expect(store.getPersons[0].groups[0]).toEqual(store.getGroups[0].groupName);
        expect(store.getGroups[0].members[0].person.name).toEqual(personName);
    })

    test("add another person", async () => {
        let personName = "person2";
        const store = billSplitterStore();
        const addPersonComponent = wrapper.findComponent(AddPerson);
        await wrapper.find("#openAddPersonForm").trigger("click");

        addPersonComponent.vm.newPerson = personName;
        await addPersonComponent.find("#addPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[1].name).toEqual(personName);
    })

    test("edit person - change name, remove group", async () => {
        let newPersonName = "edit";
        const store = billSplitterStore();
        const editPersonComponent = wrapper.findComponent(EditPerson);
        let groupMembersAfter = store.getGroups[0].members.length - 1;

        await wrapper.find(".openEditPersonForm").trigger("click");
        wrapper.vm.editPersonObj.name = newPersonName;
        wrapper.vm.editPersonObj.groups = [];
        await editPersonComponent.find("#editPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[0].name).toEqual(newPersonName);
        expect(store.getPersons[0].groups.length).toEqual(0);
        expect(store.getGroups[0].members.length).toEqual(groupMembersAfter);
    })

    test("edit person - change name, add group", async () => {
        let newPersonName = "edit2";
        const store = billSplitterStore();
        const editPersonComponent = wrapper.findComponent(EditPerson);
        let groupMembersAfter = store.getGroups[0].members.length + 1;
        store.groups = [{ groupName: "group", members: [], expense: 0 }];
        await nextTick();

        await wrapper.find(".openEditPersonForm").trigger("click");
        editPersonComponent.vm.editPersonObj.name = newPersonName;
        editPersonComponent.vm.newPersonGroups[0] = true;
        editPersonComponent.vm.editPersonObj.groups = [];
        await editPersonComponent.find("#editPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[0].name).toEqual(newPersonName);
        expect(store.getPersons[0].groups.length).toEqual(1);
        expect(store.getGroups[0].members.length).toEqual(groupMembersAfter);
    })

    test("cancel adding person", async () => {
        let personName = "person2";
        const store = billSplitterStore();
        const editPersonComponent = wrapper.findComponent(EditPerson);
        let name = store.getPersons[0].name;
        await wrapper.find(".openEditPersonForm").trigger("click");
        editPersonComponent.vm.newPerson = personName;
        await editPersonComponent.find("#cancelEditButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[0].name).toEqual(name);
    })

    test("remove person", async () => {
        const store = billSplitterStore();
        let personCount = store.getPersons.length;
        await wrapper.find(".removePerson").trigger("click");
        expect(store.getPersons.length).toEqual(personCount - 1);
    })
})