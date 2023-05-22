import axios from "axios";
import BASE_URL from "@/config";
import store from "@/store";

const access_header = {headers: {'Authorization': 'Bearer ' + store.getters.accessToken}}
export function submitBooking(booking) {
    return axios.post(`${BASE_URL}/booking/save`, booking,access_header)
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}
export function deleteAllBookings(bookings) {
    return axios.post(`${BASE_URL}/booking/delete-all`, bookings, access_header)
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response.data)
        });
}