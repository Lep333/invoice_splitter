import { createWebHistory, createRouter } from 'vue-router';

import Persons from './components/Persons.vue';
import Groups from './components/Groups.vue';
import Expenses from './components/Expenses.vue';

const routes = [
    { path: '/persons', component: Persons },
    { path: '/groups', component: Groups },
    { path: '/expenses', component: Expenses },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;