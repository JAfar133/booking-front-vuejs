<template>
  <div class="bg-light">
    <div class="booking container py-5">
      <person-details :booking-error="''" class="person-details"></person-details>
      <BookingForm :bookings="bookings" :places="places" class="booking-form" @bookingIsValid="submitBooking"></BookingForm>
    </div>
  </div>
</template>

<script>

import BookingForm from "@/components/BookingForm.vue";
import PersonDetails from "@/components/PersonDetails.vue";
import { getRoomHalls, getBookings } from '@/mainApi';
import {mapMutations, mapState} from "vuex";
import axios from "axios";

export default {
  name: "BookingPage",
  components: {
    BookingForm,
    PersonDetails
  },
  data() {
    return {
      places: [],
      sessionPerson: null,
      bookings: [],
      place: null
    }
  },
  methods: {
    getRoomHalls() {
      getRoomHalls()
          .then(data => {
            this.places = data;
          });
    },
    getBookings() {
      getBookings()
          .then(data => {
            this.bookings = data;
          });
    },
    async submitBooking(){
      this.setCustomer(this.person)
      axios.post('http://localhost:8080/booking/save', this.booking,
          {
            headers: {
              'Authorization': 'Bearer ' + this.access_token
            }
          }
      )
          .then((response) =>{
            console.log(response)
            window.location.href="/"
          })
          .catch(error => {
            console.log(error)
          })
    },
    ...mapMutations({
      setBooking: 'setBooking',
      setCustomer: 'setCustomer'
    })
  },
  mounted() {
    this.$nextTick(function (){
      this.getRoomHalls();
      this.getBookings();
      const booking = JSON.parse(localStorage.getItem('booking'));
      booking && this.setBooking(booking);
    });
  },
  computed: {
    ...mapState({
      person: state => state.person.person,
      booking: state => state.booking.booking,
      access_token: state => state.person.access_token
    })
  }
}
</script>

<style scoped>
  .booking-form {
    width: 450px;
  }
  .person-details{
    width: 700px;
  }
  .booking{
    display: flex;
    justify-content: space-between;
  }
</style>