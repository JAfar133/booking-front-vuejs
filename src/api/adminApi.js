import VueCookies from "vue-cookies";
import axios from "axios";
import BASE_URL from "@/config";
import store from "@/store";

function getAuthorizationHeader(){
    return {headers: {'Authorization': 'Bearer ' + VueCookies.get('access_token')}}
}
export function confirmBooking(bookingId) {
    return axios.post(`${BASE_URL}/admin/booking-confirm/${bookingId}`,{}, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function rejectBooking(bookingId) {
    return axios.post(`${BASE_URL}/admin/booking-reject/${bookingId}`,{}, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function cancelBookingRejection(bookingId) {
    return axios.post(`${BASE_URL}/admin/booking-cancel-rejection/${bookingId}`,{}, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function updateBooking(booking) {
    return axios.post(`${BASE_URL}/admin/booking-update/${booking.id}`,booking, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function deleteBooking(booking) {
    return axios.delete(`${BASE_URL}/admin/${booking.id}`, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function deletePerson(person) {
    return axios.delete(`${BASE_URL}/admin/person/${person.id}`, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function makeAdmin(person) {
    return axios.post(`${BASE_URL}/admin/make-admin/${person.id}`,{}, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function makeUser(person) {
    return axios.post(`${BASE_URL}/admin/make-user/${person.id}`,{}, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}
export function getPersons() {
    return axios.get(`${BASE_URL}/admin/get-all-person`, getAuthorizationHeader())
        .then(response=> response.data)
        .catch(error=>{
            throw new Error(error.response.data)
        })
}