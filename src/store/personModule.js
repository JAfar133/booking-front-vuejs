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
            post: null,
            institute: null,
            course: null,
            structure:null
        },
        isAuthorized: false,
        loginFormShow: false,
    }),
    getters: {
        phoneNumber(state) {
            return state.person.phoneNumber
        },
        isAuthorized(state){
            return state.isAuthorized
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
        }

    },
    actions: {
        async findPersonById({state, commit}){
            const cookieUserId = VueCookies.get('userId')
            if (cookieUserId) {
                commit('setPersonId', cookieUserId);
                axios.get(`http://localhost:8080/person/${state.personId}`)
                    .then((response) =>{
                        commit('setPerson', response.data);
                        commit('setPersonId', response.data.id)
                        commit('setIsAuthorized',true);
                        console.log("asdhashdasdjhsadjh123")
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },
        deletePersonFromCookie({commit}){
            VueCookies.remove('userId')
            commit('setPersonId', null)
            commit('setPerson', {
                id: null,
                lastName: null,
                firstName: null,
                middleName: null,
                phoneNumber: null,
                post: null,
                institute: null,
                course: null,
                structure:null
            })
            commit('setIsAuthorized', false)
        }
    }
}