import axios from 'axios';
import BASE_URL from '@/config.js';
function getRoomHalls() {
    return axios.get(`${BASE_URL}/roomHall`)
        .then(response => response.data)
        .catch(error => {
            console.log(error);
            return [];
        });
}

function getBookings() {
    return axios.get(`${BASE_URL}/booking`)
        .then(response => response.data.sort(bookingSort))
        .catch(error => {
            console.log(error);
            return [];
        });
}

function bookingSort(a, b) {
    const placeA = a.place;
    const placeB = b.place;
    if (placeA.name < placeB.name) {
        return -1;
    }
    if (placeA.name > placeB.name) {
        return 1;
    }
    if (placeA.address < placeB.address) {
        return -1;
    }
    if (placeA.address > placeB.address) {
        return 1;
    }
    return 0;
}

export { getRoomHalls, getBookings, bookingSort };
