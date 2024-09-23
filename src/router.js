import { createWebHistory, createRouter } from 'vue-router';

import Persons from './components/Persons.vue';
import Groups from './components/Groups.vue';

const routes = [
    { path: '/persons', component: Persons },
    { path: '/groups', component: Groups },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;