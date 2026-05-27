import { createRouter, createWebHistory } from 'vue-router';
import EventTypesPage from '../views/EventTypesPage.vue';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'event-types',
            component: EventTypesPage,
        },
        {
            path: '/event/:eventTypeId',
            name: 'booking',
            component: () => import('../views/BookingPage.vue'),
        },
        {
            path: '/admin',
            component: () => import('../views/AdminLayout.vue'),
            children: [
                {
                    path: '',
                    redirect: '/admin/bookings',
                },
                {
                    path: 'bookings',
                    name: 'admin-bookings',
                    component: () => import('../views/AdminBookingsPage.vue'),
                },
                {
                    path: 'event-types',
                    name: 'admin-event-types',
                    component: () => import('../views/AdminEventTypesPage.vue'),
                },
                {
                    path: 'slots',
                    name: 'admin-slots',
                    component: () => import('../views/AdminSlotsPage.vue'),
                },
            ],
        },
    ],
});
export default router;
