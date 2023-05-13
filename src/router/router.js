
import {createRouter, createWebHistory} from "vue-router";
import VueMain from "@/pages/VueMain.vue";
import BookingList from "@/pages/BookingList.vue";
import PersonData from "@/pages/PersonData.vue";
import VueCookies from "vue-cookies";
import MyRooms from "@/pages/MyRooms.vue";
import BookingPage from "@/pages/BookingPage.vue";

const routes = [
    {
        path: '/',
        component: VueMain
    },
    {
        path: '/bookings',
        component: BookingList,
        meta: { requiresAuth: true }
    },
    {
        path: '/me',
        component: PersonData,
        meta: { requiresAuth: true }
    },
    {
        path: '/rooms',
        component: MyRooms
    },
    {
        path: '/booking',
        component: BookingPage
    }

]

const router = createRouter({
    routes,
    history: createWebHistory()
})
router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = VueCookies.get('access_token');
        if (!token && token !== undefined) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})
export default router;