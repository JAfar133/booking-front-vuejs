
import {createRouter, createWebHistory} from "vue-router";
import VueMain from "@/pages/main_page/VueMain.vue";
import BookingList from "@/pages/booking_list_page/BookingList.vue";
import PersonData from "@/pages/person_profile_page/PersonData.vue";
import MyRooms from "@/pages/rooms_page/MyRooms.vue";
import BookingPage from "@/pages/booking_page/BookingPage.vue";
import store from "@/store";
import VueCookies from "vue-cookies";
import AdminPage from "@/pages/admin_page/AdminPage.vue";
async function authorizedEndPoints(to, from, next) {
    const isAuthorized = localStorage.getItem("isAuthorized")
    if (isAuthorized)
        next()
    else {
        next('/')
        store.commit('setLoginFormShow',true)
    }
}
async function adminEndPoints(to, from, next){
    const isAdmin = localStorage.getItem("role")==="ADMIN";
    if(isAdmin)
        next()
    else next('/')
}
const routes = [
    {
        path: '/',
        component: VueMain,
    },
    {
        path: '/bookings',
        component: BookingList,
        beforeEnter: authorizedEndPoints
    },
    {
        path: '/me',
        component: PersonData,
        beforeEnter: authorizedEndPoints
    },
    {
        path: '/rooms',
        component: MyRooms,
    },
    {
        path: '/booking',
        component: BookingPage
    },
    {
        path: '/admin',
        component: AdminPage,
        beforeEnter: adminEndPoints
    },
    {
        path: '/admin/confirmed',
        component: AdminPage,
        beforeEnter: adminEndPoints
    },
    {
        path: '/admin/unconfirmed',
        component: AdminPage,
        beforeEnter: adminEndPoints
    },
    {
        path: '/admin/rejected',
        component: AdminPage,
        beforeEnter: adminEndPoints
    },
    {
        path: '/admin/users',
        component: AdminPage,
        beforeEnter: adminEndPoints
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
                setTimeout(next(referer),100);
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

export default router;