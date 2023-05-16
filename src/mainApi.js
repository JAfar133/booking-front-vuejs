import axios from 'axios';

function getRoomHalls() {
    return axios.get('http://195.133.49.102:8080/roomHall')
        .then(response => response.data)
        .catch(error => {
            console.log(error);
            return [];
        });
}

function getBookings() {
    return axios.get('http://195.133.49.102:8080/booking')
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
