<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-main>
      <v-container
          class="py-8 px-6"
          fluid
      >
        <v-row>
          <v-expansion-panels>
            <v-expansion-panel v-for="(booking, index) in bookings">
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="2">
                    <div  class="mx-3 text-success" v-if="booking.confirmed">
                      <v-icon icon="mdi-check-outline"></v-icon>
                      Подтверждено
                    </div>
                    <div v-else  class="mx-3 text-danger">
                      <v-icon icon="mdi-close-octagon"></v-icon>
                      Не подтверждено
                    </div>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-start">
                    <v-icon class="mx-3" icon="mdi-map-marker-outline"></v-icon>
                    <div class="flex-column">
                      <div>{{ booking.place.name }}, {{ booking.place.address }}</div>
                      <span >{{ new Date(booking.bookedAt).toLocaleString() }}</span>
                    </div>
                  </v-col>
                  <v-col cols="4" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <v-row no-gutters style="width: 100%">
                        <v-col cols="6" class="d-flex justify-start">
                          <v-icon class="mx-3" icon="mdi-calendar-range"></v-icon>
                          <div>
                            <div><strong >{{ normalizeDate(booking.date) }}</strong></div>
                            <div>{{ booking.timeStart.substring(0, 5) }}-{{ booking.timeEnd.substring(0, 5) }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="info-panel">
                  <v-tooltip
                    location="end"
                  >
                  <template v-slot:activator="{ props }">
                    <v-chip
                        pill
                        link
                        v-bind="props"
                        size="large"
                    >
                      <v-icon icon="mdi-calendar-account" style="margin-right: 10px"></v-icon>
                      {{ booking.customer.lastName }} {{ booking.customer.firstName }} {{ booking.customer.middleName }}
                    </v-chip>
                  </template>
                  <span>{{ booking.customer.lastName }} {{ booking.customer.firstName }} {{ booking.customer.middleName }}</span>
                </v-tooltip>
                <div class="main-details mt-4">
                  <div><a class="text-h6" :href="'tel:'+booking.customer.phoneNumber"><v-icon size="small" icon="mdi-phone"></v-icon>{{ booking.customer.phoneNumber }}</a></div>
                  <div><a :href = "'mailto:'+ booking.customer.email"><v-icon size="small" icon="mdi-email"></v-icon>{{ booking.customer.email }}</a></div>
                  <div>
                    {{ booking.customer.post }}
                    <template v-if="booking.customer.post==='Студент'">
                      {{ booking.customer.course }} курса {{ booking.customer.institute }}
                    </template>
                    <template v-else>
                      {{ booking.customer.structure }}
                    </template>
                  </div>
                </div>
                <div class="comment" v-if="booking.comment">
                  <div><v-icon size="small" icon="mdi-comment-text"></v-icon>
                    {{ booking.comment }}
                  </div>
                </div>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="text" color="secondary" @click="confirmBooking(booking,index)">Подтвердить</v-btn>
                  <v-btn variant="text" color="primary">Изменить дату</v-btn>
                  <v-btn variant="text" color="danger" @click="rejectBooking(booking, index)">Отклонить</v-btn>
                </v-card-actions>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {getBookings} from "@/api/mainApi";
import {mapState} from "vuex";
import NavBar from "@/pages/admin_page/NavBar.vue";
import moment from "moment/moment";
import {confirmBooking, rejectBooking} from "@/api/adminApi";

export default {
  components: {NavBar},
  data() {
      return {

        bookings: []
      };
  },
  created() {
    this.fetchBookings();
  },
  methods: {
    normalizeDate(date){
      return moment(this.getDateObject(date)).locale('ru').format("DD.MM.YYYY")
    },
    getDateObject(date){
      return new Date(date[0],date[1]-1,date[2])
    },
    fetchBookings() {
      getBookings()
          .then(data => {
            this.bookings = data.sort(this.sortByDate);
          });
    },
    rejectBooking(booking, index) {
      rejectBooking(booking.id)
          .then(responseBooking=>{
            this.bookings[index] = responseBooking
          })
          .catch(error=>{
            console.log(error)
          })
    },
    confirmBooking(booking, index) {
      confirmBooking(booking.id)
          .then(responseBooking=>{
            this.bookings[index] = responseBooking
          })
          .catch(error=>{
            console.log(error)
          })
    },
    editBookingDate(booking) {

    },
    sortByDate(b1, b2){
      const dateA = this.getDateObject(b1.date);
      const dateB = this.getDateObject(b2.date);
      if (dateA.getTime()< dateB.getTime()) {
        return -1;
      }
      if (dateA.getTime()> dateB.getTime()) {
        return 1;
      }
      return 0;
    }
  },
  computed:{
    ...mapState({
      person: state => state.person.person
    })
  }
};
</script>
<style scoped lang="scss">
  a{
    text-decoration: none;
    color: #4d4d4d;
    &:hover{
      color: #1B77FD;
    }
  }
  .main-details{
    color: #4d4d4d;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
  .mdi{
    margin-right: 15px;
  }
  .info-panel{
    display: flex;
    flex-direction: row;
  }
  .flex-column{
    span {
      font-size: 13px;
      color: #aaaab3;
    }
  }
</style>