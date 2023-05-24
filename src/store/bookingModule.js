export const bookingModule = {
    state: () => ({
        booking: {
            id: null,
            place: null,
            date: null,
            timeStart: null,
            timeEnd: null,
            comment: '',
            customer: null,
            confirmed: false,
            bookedAt: null
        },
    }),
    getters: {
        booking(state) {
            return state.booking
        },
    },
    mutations: {
        setBooking(state, booking){
            state.booking = booking
        },
        setDate(state, date){
            state.booking.date = date
        },
        setCustomer(state, customer){
            state.booking.customer = customer
        },
        setPlace(state, place){
            state.booking.place = place
        }

    },
    actions: {

    }
}