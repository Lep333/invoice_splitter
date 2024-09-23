import { createMemoryHistory, createRouter } from 'vue-router';

import Persons from "./components/Persons.vue";

const routes = [
    { path: '/persons', component: Persons }
];

const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export default router;