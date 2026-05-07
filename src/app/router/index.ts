import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'clients',
            component: () => import('@/pages/ClientsPage.vue'),
        },
        {
            path: '/clients/:id',
            name: 'client-details',
            component: () => import('@/pages/ClientPage.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/pages/NotFoundPage.vue'),
        },
    ],
    scrollBehavior() {
        return { top: 0 }
    },
})

export default router