<template>
  <div class="container booking-list" >
    <div class="" v-if="bookings.length">
      <v-checkbox
             v-model="allSelected"
             @change="allSelectedInput"
             color="info"
             label="Выбрать все"
      >
      </v-checkbox>
      <button
          v-if="selectBookings.length>0"
          class="btn btn-outline-danger mx-3"
          @click="deleteBooking"
      >Удалить выбранное</button>
      <div
          class="card-item"
          v-for="(booking, idx) in bookings"
          :key="booking.id"
      >
        <v-checkbox :value="booking" v-model="selectBookings" color="info"></v-checkbox>
        <v-card
            style="width:100%"
            v-ripple @click="cartClick(booking)"
            :class="{'card-selected':isSelected(booking)}"
            theme="light"
        >
          <v-card-title>
            <div class="flex-row">

              <div>
                <v-icon v-if="booking.confirmed" icon="mdi-timeline-check-outline" color="green"></v-icon>
                <v-icon v-else-if="booking.rejected" icon="mdi-timeline-check-outline" color="danger"></v-icon>
                <v-icon v-else icon="mdi-timeline-alert-outline" color="primary"></v-icon>
                {{ booking.place.name }}, {{ booking.place.address }}
              </div>
              <div>
                № {{ idx }}
              </div>
            </div>
          </v-card-title>
          <v-card-subtitle>

            {{ new Date(booking.bookedAt).toLocaleString() }}
          </v-card-subtitle>
          <v-card-text>
             <div class="font-weight-normal">
               <strong>{{ normalizeDate(booking.date) }}</strong>
             </div>
             <v-timeline density="compact" style="max-width: 200px">

               <v-timeline-item
                   size="small"
                   dot-color="blue-darken-3"
                   icon="mdi-clock-time-seven-outline"
               >
                 <div><strong>Начало</strong></div>
                 <div class="">
                   <div>{{ booking.timeStart.substring(0,5) }}</div>
                 </div>
               </v-timeline-item>
               <v-timeline-item
                   size="small"
                   dot-color="blue-darken-3"
                   icon="mdi-clock-time-ten-outline"
               >
                 <div><strong>Конец</strong></div>
                 <div class="">
                   <div>{{ booking.timeEnd.substring(0,5) }}</div>
                 </div>
               </v-timeline-item>
             </v-timeline>
            <div v-if="booking.confirmed" class="text-success">Бронь подтверждена</div>
            <div v-else-if="booking.rejected" class="text-danger">Бронь отклонена</div>
            <div v-else class="text-primary">Бронь не подтверждена</div>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <div class="container" style="min-height: 95vh" v-else>
      <h1>У вас нет забронированных помещений</h1>
    </div>
  </div>

</template>

<script>
import {mapState} from "vuex";
import moment from "moment";
import {deleteSelecedBookings, getPersonBookings} from "@/api/personApi";
export default {
  name: "BookingList",
  components:{

  },
  data(){
    return {
      bookings: [],
      selectBookings: [],
      allSelected: false,
      skeletonLoader: true
    }
  },
  methods: {
    deleteBooking(){
      deleteSelecedBookings(this.selectBookings)
          .then(()=>{
            this.getBookings()
            this.selectBookings = []
          })
          .catch(error=>{
            console.log(error)
          })
    },
    getBookings() {
      getPersonBookings(this.personId)
          .then(bookings=>this.bookings = bookings)
          .catch(()=>this.bookings = [])
    },
    allSelectedInput(){
      this.selectBookings = [...this.bookings];
      if(!this.allSelected) this.selectBookings = [];
    },
    cartClick(booking){
      const idx = this.selectBookings.indexOf(booking)
      if(idx!==-1) {
        this.selectBookings.splice(idx,1);
        this.allSelected = false;
      }
      else {
        this.selectBookings.push(booking);
        if(this.selectBookings.length===this.bookings.length){
          this.allSelected = true;
        }
      }
    },
    normalizeDate(date){
      return moment(new Date(date[0],date[1]-1,date[2])).locale('ru').format("Do MMM YYYY")
    },
    isSelected(booking){
      return this.selectBookings.includes(booking)
    },
  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      access_token: state => state.person.access_token
    }),

  },
  mounted() {

  },
  created() {
    this.getBookings()
  },
  watch: {
    personId(){
      this.getBookings()
    },
    selectBookings(){
      this.allSelected = this.selectBookings.length === this.bookings.length;
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    width: 100%;
  }
  .card-selected{
    background: lightgray;
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
    min-height: 100vh;
  }
  input[type=checkbox]{
    margin-right: 20px;
  }
  .flex-row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>