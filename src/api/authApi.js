import axios from "axios";
import BASE_URL from "@/config";
import store from "@/store";
export function loginByEmail(authData) {
    return axios.post(`${BASE_URL}/auth/login/email`,authData)
        .then(response => {
            saveTokens(response.data.access_token, response.data.refresh_token)
            return response.data;
        })
        .catch(error=>{
            return error.response.data;
        })
}

export function verifyAndAuth(code, phoneNumber) {
    return axios.post(`${BASE_URL}/sms/verifyCode-and-auth?code=${code}&phoneNumber=${encodeURIComponent(phoneNumber)}` )
        .then((response) => {
            saveTokens(response.data.access_token, response.data.refresh_token)
            return response.data;
        })
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export function signUp(person) {
    return axios.post(`${BASE_URL}/auth/signin`,person)
        .then(response=>{
            saveTokens(response.data.access_token, response.data.refresh_token)
            return response.data;
            
        })
        .catch(error => {
            throw new Error(error.response.data)
        });
}
function saveTokens(access_token,refresh_token) {
    store.commit('setAccessToken',access_token);
    store.commit('setRefreshToken',refresh_token);
    store.dispatch('saveTokenToCookie');
}
