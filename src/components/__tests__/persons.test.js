import { mount } from "@vue/test-utils";
import Persons from "../Persons.vue";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, createPinia } from "pinia/dist/pinia.prod.cjs";
import { billSplitterStore } from '@/store';

describe("Persons.vue", () => {
    const wrapper = mount(Persons, {
        global: {
            plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        },
    })

    test("add person", async () => {
        let personName = "test";
        const store = billSplitterStore();

        store.groups = [{ groupName: "group", members: [], expense: 0 }];
        wrapper.vm.newPerson = personName;
        wrapper.vm.newPersonGroups[0] = true;
        await wrapper.find("#addPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(1);
        expect(store.getPersons[0].name).toEqual(personName);
        expect(store.getPersons[0].groups[0]).toEqual(store.getGroups[0].groupName);
        expect(store.getGroups[0].members[0].person.name).toEqual(personName);
    })

    test("add another person", async () => {
        let personName = "person2";
        const store = billSplitterStore();

        wrapper.vm.newPerson = personName;
        await wrapper.find("#addPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[1].name).toEqual(personName);
    })

    test("edit person - change name, remove group", async () => {
        let newPersonName = "edit";
        const store = billSplitterStore();
        let groupMembersAfter = store.getGroups[0].members.length - 1;

        await wrapper.find(".editButton").trigger("click");
        wrapper.vm.editPersonObj.name = newPersonName;
        wrapper.vm.editPersonObj.groups = [];
        await wrapper.find("#editPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[0].name).toEqual(newPersonName);
        expect(store.getPersons[0].groups.length).toEqual(0);
        expect(store.getGroups[0].members.length).toEqual(groupMembersAfter);
    })

    test("edit person - change name, add group", async () => {
        let newPersonName = "edit2";
        const store = billSplitterStore();
        let groupMembersAfter = store.getGroups[0].members.length + 1;
        store.groups = [{ groupName: "group", members: [], expense: 0 }];

        await wrapper.find(".editButton").trigger("click");
        wrapper.vm.editPersonObj.name = newPersonName;
        wrapper.vm.newPersonGroups[0] = true;
        wrapper.vm.editPersonObj.groups = [];
        await wrapper.find("#editPersonButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(store.getPersons[0].name).toEqual(newPersonName);
        expect(store.getPersons[0].groups.length).toEqual(1);
        expect(store.getGroups[0].members.length).toEqual(groupMembersAfter);
    })

    test("cancel adding person", async () => {
        let personName = "person2";
        const store = billSplitterStore();

        wrapper.vm.newPerson = personName;
        await wrapper.find("#cancelButton").trigger("click");
        expect(store.getPersons.length).toEqual(2);
        expect(wrapper.vm.newPerson).toEqual("");
    })

    test("remove person", async () => {
        const store = billSplitterStore();

        await wrapper.find(".removeButton").trigger("click");
        expect(store.getPersons.length).toEqual(1);
    })
})