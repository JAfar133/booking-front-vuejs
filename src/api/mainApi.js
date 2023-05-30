import axios from 'axios';
import BASE_URL from '@/config.js';
import {sortByPlace} from "@/utils/bookingSort";
export function getRoomHalls() {
    return axios.get(`${BASE_URL}/roomHall`)
        .then(response => response.data)
        .catch(error => {
            console.log(error);
            return [];
        });
}

export function getBookings() {
    return axios.get(`${BASE_URL}/booking/get-all-not-rejected`)
        .then(response => response.data.sort(sortByPlace))
        .catch(error => {
            console.log(error);
            return [];
        });
}
export function getAllBookings() {
    return axios.get(`${BASE_URL}/booking`)
        .then(response => response.data.sort(sortByPlace))
        .catch(error => {
            console.log(error);
            return [];
        });
}

