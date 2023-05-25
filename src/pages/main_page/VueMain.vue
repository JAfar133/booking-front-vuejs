<template>
  <HeroSection :places="places" :bookings="bookings" :place="place" @bookingIsValid="bookingIsValid"/>
  <div class="main-section ">
      <div class="qalendar-title">
        <h3 id="title" class="text-center">Календарь бронирований</h3>
        <p class="text-center">Здесь вы можете посмотреть свободные помещения на нужную дату</p>
      </div>
    <hr class="w-100">
    <div class="qalendar container">
      <img src="/img/wave.svg" class="wave" id="wave1" alt="">
      <my-qalendar :places="places" :bookings="bookings"></my-qalendar>
      <img src="/img/wave.svg" class="wave" id="wave2" alt="">
    </div>
  </div>
</template>

<script>
import HeroSection from "@/pages/main_page/components/HeroSection.vue";
import MyQalendar from "@/pages/main_page/components/MyQalendar.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import { getRoomHalls, getBookings} from '@/api/mainApi';
export default {
  name: 'VueMain',
  components: {
    MyQalendar,
    HeroSection
  },

  data() {
    return {
      places: [],
      sessionPerson: null,
      bookings: [],
      place: null,
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
    onScroll(e){
      console.log(e.target.scrollTop)
    },
    bookingIsValid(){
      localStorage.setItem('booking', JSON.stringify(this.booking));
      this.$router.push('/booking');
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

  },
  mounted() {
    this.$nextTick(function (){
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
.qalendar-title {
}
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
.wave{
  position: absolute;
  width: 100%;
  right: 0;

}
#wave2{
  width: 100vw;
  left: 0;
  transform: scaleX(-1)
}
</style>
