<template>
  <HeroSection :places="places" :date="date" :bookings="bookings" @changeDate="changeDate"/>
  <div class="main-section ">
    <div class="qalendar-title">
      <h3 id="title" class="text-center">Календарь бронирований</h3>
      <p class="text-center">Здесь вы можете посмотреть свободные помещения на нужную дату</p>
    </div>
    <hr class="w-100">
    <div class="qalendar container">
      <my-qalendar :places="places" :bookings="bookings" @dayClicked="dayClicked" :date="date"></my-qalendar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import HeroSection from "@/components/HeroSection.vue";
import MyQalendar from "@/components/MyQalendar.vue";
import {mapActions, mapMutations} from "vuex";
export default {
  name: 'VueMain',
  components: {
    MyQalendar,
    HeroSection
  },

  data() {
    return {
      places: [],
      date: null,
      sessionPerson: null,
      bookings: [],
      yandex: null
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
    getRoomHalls(){
      axios.get('http://localhost:8080/roomHall')
          .then(response =>{
            this.places = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    },
    getBookings(){
      axios.get('http://localhost:8080/booking')
          .then(response =>{
            this.bookings = response.data.sort(this.bookingSort);
          })
          .catch(error => {
            console.log(error);
          });
    },
    bookingSort(a, b){
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
    },
    dayClicked(day) {
      this.date = day;
    },
    changeDate(date){
      this.date = date;
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
      console.log("from mounted")
      this.getTokensFromParams();
      this.getRoomHalls();
      this.getBookings();
    });
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
