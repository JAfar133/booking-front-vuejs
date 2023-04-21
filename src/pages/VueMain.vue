<template>
  <MyHeader/>
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
  <my-footer/>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
import axios from 'axios'
import HeroSection from "@/components/HeroSection.vue";
import MyQalendar from "@/components/MyQalendar.vue";
import MyFooter from "@/components/MyFooter.vue";
export default {
  name: 'VueMain',
  components: {
    MyFooter,
    MyQalendar,
    HeroSection,MyHeader
  },

  data() {
    return {
      places: [],
      date: null,
      sessionPerson: null,
      bookings: []
    }
  },
  methods: {
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
            this.bookings = response.data;
          })
          .catch(error => {
            console.log(error);
          });
    },
    dayClicked(day) {
      this.date = day;
    },
    changeDate(date){
      this.date = date;
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

<style>
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
