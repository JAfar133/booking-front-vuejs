import axios from "axios";
import BASE_URL from "@/config";
import VueCookies from "vue-cookies";
function getAuthorizationHeader(){
    return {headers: {'Authorization': 'Bearer ' + VueCookies.get('access_token')}}
}
export function submitBooking(booking) {
    return axios.post(`${BASE_URL}/booking/save`, booking, getAuthorizationHeader())
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export function deleteAllBookings(bookings) {
    return axios.post(`${BASE_URL}/booking/delete-all`, bookings, getAuthorizationHeader())
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export function changePersonData(person) {
    return axios.post(`http://localhost:8080/person`,person,getAuthorizationHeader())
        .then(response=> {
            console.log("response: "+ response.data)
            return response.data
        })
        .catch(error => {
            console.log("error:" + error)
            console.log("error:" + error.response.data)
            throw new Error(error.response.data)
        });
}
