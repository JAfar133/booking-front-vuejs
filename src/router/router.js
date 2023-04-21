
import {createRouter, createWebHistory} from "vue-router";
import VueMain from "@/pages/VueMain.vue";
import BookingList from "@/pages/BookingList.vue";
import PersonData from "@/pages/PersonData.vue";
import VueCookies from "vue-cookies";

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
]

const router = createRouter({
    routes,
    history: createWebHistory()
})
router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const userId = VueCookies.get('userId');
        console.log(userId)
        if (!userId) {
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