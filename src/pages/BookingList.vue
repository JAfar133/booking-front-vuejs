<template>
  <MyHeader/>
  <div class="container booking-list" v-if="bookings.length">
    <input type="checkbox" v-model="allSelected" @change="selectBookings=bookings"><label>Выбрать все</label>
    <div
        class="card-item"
        v-for="(booking,idx) in bookings"
        :key="booking.id"
    >
      <input type="checkbox" :value="booking" v-model="selectBookings">
      <div class="card">
        <div class="card-header">
          <h5>№ {{ idx }}</h5>
          <h5>Дата заказа {{ new Date(booking.bookedAt).toLocaleString() }}</h5>
        </div>
        <div class="card-body">
          <h4>{{ booking.place.name }}, {{ booking.place.address }}</h4>
          <h5> Бронирование на {{ normalizeDate(booking.date) }}, с {{ booking.timeStart.substring(0,5) }} по {{ booking.timeEnd.substring(0,5) }} </h5>
          <h5 :class="{ 'confirmed': booking.confirmed }" style="color: red">
            {{ booking.confirmed ? 'Бронирование подтверждено ': 'Мы скоро с вами свяжемся для подтверждения бронирования' }}
          </h5>
        </div>
      </div>
    </div>
  </div>
  <div class="container" v-else>
    <h1>У вас нет забронированных помещений</h1>
  </div>
  <my-footer/>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
import {mapState} from "vuex";
import axios from "axios";
import moment from "moment";
import MyFooter from "@/components/MyFooter.vue";
export default {
  name: "BookingList",
  components: {MyFooter, MyHeader},
  data(){
    return {
      bookings: [],
      selectBookings: [],
      allSelected: false
    }
  },
  methods: {
    getBookings() {
      axios.get(`http://localhost:8080/person/get-bookings/${this.personId}`)
          .then(response => {
            this.bookings = response.data
          })
          .catch(error => {
            this.bookings = []
            console.log(error)
          })
    },
    normalizeDate(date){
      return moment(new Date(date[0],date[1],date[2])).locale('ru').format("Do MMM YY")
    }
  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person
    })
  },
  mounted() {
    this.$nextTick(function (){
      this.getBookings()
    })
  },
  watch: {
    personId(){
      this.getBookings()
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    width: 100%;
  }
  .card-header{
    display: flex;
    justify-content: space-between;
  }
  .confirmed {
    color: green !important;
  }
  .card-item {
    margin-top: 30px;
    display: flex;
    justify-content: left;
    flex-direction: row;
  }
  .booking-list {
    margin-top: 100px;
    padding-bottom: 50px;
  }
  input[type=checkbox]{
    margin-right: 20px;
  }

</style>