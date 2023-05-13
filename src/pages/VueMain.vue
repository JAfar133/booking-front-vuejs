<template>
  <HeroSection :places="places" :bookings="bookings" :place="place" @bookingIsValid="bookingIsValid"/>
  <div class="main-section ">
<!--    <about-us-section/>-->

    <div class="qalendar-title">
      <h3 id="title" class="text-center">Календарь бронирований</h3>
      <p class="text-center">Здесь вы можете посмотреть свободные помещения на нужную дату</p>
    </div>
    <hr class="w-100">

    <div class="qalendar container">
      <my-qalendar :places="places" :bookings="bookings"></my-qalendar>
    </div>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue";
import MyQalendar from "@/components/MyQalendar.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import { getRoomHalls, getBookings} from '@/mainApi';
// import AboutUsSection from "@/components/AboutUsSection.vue";
export default {
  name: 'VueMain',
  components: {
    // AboutUsSection,
    MyQalendar,
    HeroSection
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
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow',
      setAccessToken: 'setAccessToken',
      setRefreshToken: 'setRefreshToken'
    }),
    ...mapActions({
      saveTokenToCookie: 'saveTokenToCookie',
    }),
    bookingIsValid(){
      localStorage.setItem('booking', JSON.stringify(this.booking))
      window.location.href="/booking"
    },
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
    getTokensFromParams() {
      const uri = window.location.href.split('?');
      if (uri.length === 2) {
        const variables = uri[1].split("&");
        let accessToken = '';
        let refreshToken = '';
        accessToken = variables[0].split('access_token=')[1];
        refreshToken = variables[1].split('refresh_token=')[1];
        if (accessToken !== '' && accessToken !== undefined
            && refreshToken !== '' && refreshToken !== undefined) {
          this.setAccessToken(accessToken);
          this.setRefreshToken(refreshToken);
          this.saveTokenToCookie();
          window.location = "/";
        }
      }
    },
  },
  mounted() {
    this.$nextTick(function (){
      this.getTokensFromParams();
      this.getRoomHalls();
      this.getBookings();

    });
  },
  computed:{
    ...mapState({
      booking: state => state.booking.booking
    })
  }
}
</script>

<style>
hr{
  color: #216DDF;
}
.qalendar {
  margin-bottom: 100px;
}

.main-section {
  padding-top: 100px;
  padding-bottom: 100px;
}
@media only screen and (max-width: 991px) {
  .qalendar {
    padding: 20px 10px;
  }
}

</style>
