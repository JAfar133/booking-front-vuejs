<template>
  <BookingForm :bookings="bookings" :places="places"></BookingForm>
</template>

<script>

import BookingForm from "@/components/BookingForm.vue";
import { getRoomHalls, getBookings} from '@/mainApi';

export default {
  name: "BookingPage",
  components: {BookingForm},
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
  },
  mounted() {
    this.$nextTick(function (){
      this.getRoomHalls();
      this.getBookings();
    });
  }
}
</script>

<style scoped>

</style>