import VueCookies from "vue-cookies";
import axios from "axios";
import BASE_URL from "@/config";

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