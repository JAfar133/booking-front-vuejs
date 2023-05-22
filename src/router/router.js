
import {createRouter, createWebHistory} from "vue-router";
import VueMain from "@/pages/VueMain.vue";
import BookingList from "@/pages/BookingList.vue";
import PersonData from "@/pages/PersonData.vue";
import MyRooms from "@/pages/MyRooms.vue";
import BookingPage from "@/pages/BookingPage.vue";
import store from "@/store";
import VueCookies from "vue-cookies";
import AdminPage from "@/pages/AdminPage.vue";

const routes = [
    {
        path: '/',
        component: VueMain,
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
    },
    {
        path: '/admin',
        component: AdminPage
    },
    {
        path: '/oauth',
        component: VueMain,
        beforeEnter: (to, from, next) => {
            const accessToken = to.query.access_token;
            const refreshToken = to.query.refresh_token;
            const referer = localStorage.getItem("currHref");
            if (accessToken && refreshToken) {
                VueCookies.set('access_token', accessToken);
                VueCookies.set('refresh_token', refreshToken);
                store.dispatch('showPersonInfo')
                // Перенаправляем пользователя на нужную страницу
                next(referer);
            } else {
                // Если токены отсутствуют, перенаправляем пользователя на страницу авторизации
                next('/');
            }
        }
    },

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