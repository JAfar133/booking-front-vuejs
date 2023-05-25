import axios from "axios";
import BASE_URL from "@/config";
import VueCookies from "vue-cookies";

export async function submitBooking(booking) {
    return axios.post(`${BASE_URL}/booking/save`, booking, getAuthorizationHeader())
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export async function checkBookingIsValid(booking) {
    return axios.post(`${BASE_URL}/booking/valid-booking`, booking)
        .then((response) => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
    
}
export async function deleteSelecedBookings(bookings) {
    return axios.post(`${BASE_URL}/booking/delete-all`, bookings, getAuthorizationHeader())
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export async function sendSms(phoneNumber, changePhone=false) {
    return axios.post(`${BASE_URL}/sms/sendSms?phoneNumber=${encodeURIComponent(phoneNumber)}&changePhoneNumber=${changePhone}`)
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export async function verifyCode(code, phoneNumber) {
    return axios.post(`${BASE_URL}/sms/verifyCode?code=${code}&phoneNumber=${encodeURIComponent(phoneNumber)}`,{},getAuthorizationHeader())
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export async function changePersonData(person) {
    return axios.post(`${BASE_URL}/person`, person,getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export async function getPersonBookings(personId) {
    return axios.get(`${BASE_URL}/person/get-bookings/${personId}`)
        .then(response => response.data.sort(bookingSortByConfirm))
        .catch(error => {
            throw new Error(error.response.data)
        });
}

function getAuthorizationHeader(){
    return {headers: {'Authorization': 'Bearer ' + VueCookies.get('access_token')}}
}
function bookingSortByConfirm(a, b) {
    if (a.confirmed !== b.confirmed) {
        return -1;
    }
    return 1;
}