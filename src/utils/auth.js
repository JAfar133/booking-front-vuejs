import store from "@/store";

let isAuth = false;
store.dispatch('showPersonInfo').then(result => {
    isAuth = result;
});

export async function isAuthenticated() {
    store.dispatch('showPersonInfo');
    isAuth = store.getters.isAuthorized;
    console.log(isAuth)
    return isAuth;
}

export async function isAdmin() {
    await store.dispatch('showPersonInfo');
    return store.getters.person==="ADMIN";
}

