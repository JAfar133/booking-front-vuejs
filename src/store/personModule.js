import axios from "axios";
import VueCookies from "vue-cookies";
export const personModule = {
    state: () => ({
        personId:null,
        person: {
            id: null,
            lastName: null,
            firstName: null,
            middleName: null,
            phoneNumber: null,
            phoneNumber_confirmed: false,
            email: null,
            provider: null,
            role: null,
            post: null,
            institute: null,
            course: 0,
            structure:null
        },
        isAuthorized: false,
        loginFormShow: false,
        access_token: VueCookies.get('access_token'),
        refresh_token: VueCookies.get('refresh_token'),
        expireTime: null,
    }),
    getters: {
        phoneNumber(state) {
            return state.person.phoneNumber
        },
        phoneNumber_confirmed(state){
            return state.person.phoneNumber_confirmed
        },
        isAuthorized(state){
            return state.isAuthorized
        },
        accessToken(state){
            return state.access_token
        },
        refreshToken(state){
            return state.refresh_token
        }
    },
    mutations: {
        setPersonId(state, id) {
            state.personId = id
        },
        setPerson(state, person){
            state.person = person
        },
        setIsAuthorized(state, isAuthorized){
            state.isAuthorized = isAuthorized
        },
        setLoginFormShow(state, show){
            state.loginFormShow = show
        },
        setPhoneNumber(state, phone){
            state.person.phoneNumber = phone;
        },
        setAccessToken(state, token){
            state.access_token = token;
        },
        setRefreshToken(state, token){
            state.refresh_token = token;
        },
        setPhoneNumberConfirmed(state, confirmed){
            state.person.phoneNumber_confirmed = confirmed
        }


    },
    actions: {
        showPersonInfo({commit,state, dispatch}){
            const cookieAccessToken = VueCookies.get('access_token')
            const cookieRefreshToken = VueCookies.get('refresh_token')
            console.log(cookieAccessToken)
            if (cookieAccessToken) {
                commit('setAccessToken',cookieAccessToken)
                commit('setRefreshToken', cookieRefreshToken)
                axios.get(`http://localhost:8080/person/showInfo`, {
                    headers: {
                        'Authorization': 'Bearer ' + cookieAccessToken
                    }
                })
                    .then((response) =>{
                        console.log(response.data)
                        const person = {
                            id: response.data.id,
                            lastName: response.data.lastName ?? state.person.lastName,
                            firstName: response.data.firstName ?? state.person.firstName,
                            middleName: response.data.middleName ?? state.person.middleName,
                            phoneNumber: response.data.phoneNumber,
                            email: response.data.email,
                            role: response.data.role,
                            provider: response.data.provider,
                            phoneNumber_confirmed: response.data.phoneNumber_confirmed,
                            post: response.data.post ?? state.person.post,
                            institute: response.data.institute ?? state.person.institute,
                            course: response.data.course === 0 ? null : response.data.course,
                            structure: response.data.structure ?? state.person.structure,
                        }
                        commit('setPerson', person);
                        commit('setPersonId', response.data.id)
                        commit('setIsAuthorized',true);
                    })
                    .catch(error => {
                        console.log(error)
                        if(cookieRefreshToken !== undefined && cookieRefreshToken !== null){
                            dispatch('refreshToken')
                        }
                    })
            }
        },
        saveTokenToCookie({state,dispatch}){
            VueCookies.set('access_token',state.access_token);
            VueCookies.set('refresh_token',state.refresh_token);
            dispatch('showPersonInfo')
            setInterval(()=>{
                dispatch('refreshToken')
            },1000*60*60*12)
        },
        refreshToken({commit, dispatch}) {
            const cookieRefreshToken = VueCookies.get('refresh_token')
            axios.post(`http://localhost:8080/auth/refresh-token`, {},{
                headers: {
                    'Authorization': 'Bearer ' + cookieRefreshToken
                }
            })
                .then(response=>{
                    commit('setAccessToken',response.data.access_token)
                    commit('setRefreshToken',response.data.refresh_token)
                    VueCookies.set('access_token',response.data.access_token);
                    VueCookies.set('refresh_token',response.data.refresh_token);
                    dispatch('showPersonInfo')
                })
                .catch(error=>{
                    console.log(error)
                })
        },
        deletePersonFromCookie({commit, dispatch}){
            VueCookies.remove('access_token')
            VueCookies.remove('refresh_token')
            commit('setPersonId', null)
            commit('setPerson', {
                id: null,
                lastName: null,
                firstName: null,
                middleName: null,
                phoneNumber: null,
                phoneNumber_confirmed: null,
                email: null,
                provider: null,
                role: null,
                post: null,
                institute: null,
                course: null,
                structure:null
            })
            commit('setIsAuthorized', false)
            dispatch('logout')

        },
        logout({state}){
            axios.post(`http://localhost:8080/auth/logout`, {},{
                headers: {
                    'Authorization': 'Bearer ' + state.access_token
                }
            })
                .then(response=>{
                    console.log(response)
                })
                .catch(error=>{
                    console.log(error)
                })
        }
    }
}