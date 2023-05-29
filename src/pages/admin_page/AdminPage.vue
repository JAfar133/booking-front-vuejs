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
                      <span >дата заказа: {{ new Date(booking.bookedAt).toLocaleString() }}</span>
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
                <div class="left-side">
                  <div>
                    ФИО: <span>{{ booking.customer.lastName }} {{ booking.customer.firstName }} {{ booking.customer.middleName }} </span><br>
                    Тел: <a :href="'tel:'+booking.customer.phoneNumber">{{booking.customer.phoneNumber}}</a><br>
                    Email: <a :href="'mailto:'+booking.customer.email">{{booking.customer.email}}</a>
                  </div>
                  <div>
                    Должность: {{ booking.customer.post }}
                    <div v-if="booking.customer.post==='Студент'">
                      Курс: <span>{{ booking.customer.course }}</span><br>
                      Институт: <span>{{ booking.customer.institute }}</span>
                    </div>
                    <div v-else>
                      Структура: <span>{{ booking.customer.structure }}</span>
                    </div>
                  </div>
                  <div>
                    Комментарий: <span v-if="booking.comment"> {{booking.comment }} </span>
                    <span v-else>пусто</span>
                  </div>
                </div>
                <div class="right-side">
                  <div class="buttons">
                    <v-btn variant="text" color="secondary" @click="confirmBooking(booking,index)">Подтвердить</v-btn>
                    <v-btn variant="text" color="danger" @click="rejectBooking(booking, index)">Отклонить</v-btn>
                    <v-btn variant="text" color="primary" @click="editBookingDate(booking,index)">Изменить дату</v-btn>
                    <v-dialog
                        v-model="changeDateDialogOpen"
                        activator="parsent"
                        width="auto"
                    >
                      <template v-slot:default="{ isActive }">
                        <v-card class="dialog">
                          <v-toolbar
                              color="primary"
                              title="Изменить дату"
                          ></v-toolbar>
                          <v-card-text>
                            <div class="">
                              <label for="date-in">Дата:</label>
                              <date-picker-input v-model="bookingDate.date"/>
                            </div>
                            <div class="check-date mt-4">
                              <label for="time-start">Начало:</label>
                              <time-picker-input
                                  v-model="bookingDate.timeStart"
                                  placeholder="Выберите время начала"
                              />
                            </div>
                            <div class="check-date mt-4">
                              <label for="time-end">Конец:</label>
                              <time-picker-input
                                  v-model="bookingDate.timeEnd"
                                  placeholder="Выберите время окончания"
                              />
                            </div>
                            <v-alert v-if="changeDateError"
                                     type="warning"
                                     variant="tonal"
                                     class="mt-4">
                              <span> {{ changeDateError }}</span>
                            </v-alert>
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                                variant="text"
                                @click="closeDialog"
                            >Закрыть</v-btn>
                            <v-btn variant="text" color="primary" @click="changeDate(booking,index)">Изменить дату</v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </div>
                </div>
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
import {confirmBooking, rejectBooking, updateBooking} from "@/api/adminApi";
import TimePickerInput from "@/components/UI/TimePickerInput.vue";
import DatePickerInput from "@/components/UI/DatePickerInput.vue";
import ChangeDateModal from "@/pages/admin_page/ChangeDateModal.vue";

export default {
  components: {ChangeDateModal, DatePickerInput, TimePickerInput, NavBar},
  data() {
      return {
        bookings: [],
        date: null,
        timeStart:null,
        timeEnd:null,
        changeDateDialogOpen: false,
        bookingDate:{
          date: null,
          timeStart: null,
          timeEnd: null
        },
        changeDateError: null
      };
  },
  created() {
    this.fetchBookings();
  },
  watch: {
    '$route'() {
      this.fetchBookings();
    }
  },
  methods: {
    closeDialog(){
      this.changeDateError = null;
      this.changeDateDialogOpen = false;
    },
    normalizeDate(date){
      return moment(this.getDateObject(date)).locale('ru').format("DD-MM-YYYY")
    },
    modelDate(date){
      return moment(this.getDateObject(date)).locale('ru').format("YYYY-MM-DD")
    },
    getDateObject(date){
      return new Date(date[0],date[1]-1,date[2])
    },
    fetchBookings() {
      getBookings()
          .then(data => {
            const path = this.$route.path
            switch (path){
              case '/admin':
                this.bookings = data.sort(this.sortByDate);
                break;
              case '/admin/confirmed':
                this.bookings = data.filter(booking=>booking.confirmed).sort(this.sortByDate)
                break;
              case '/admin/unconfirmed':
                this.bookings = data.filter(booking=>!booking.confirmed).sort(this.sortByDate)
                break;
            }
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
      this.bookingDate.date = this.modelDate(booking.date)
      this.bookingDate.timeStart = booking.timeStart.substring(0, 5)
      this.bookingDate.timeEnd = booking.timeEnd.substring(0, 5)
      this.changeDateDialogOpen = true;
    },
    changeDate(booking,idx){
      let requestBooking = JSON.parse(JSON.stringify(booking));
      requestBooking.date = this.bookingDate.date
      requestBooking.timeStart = this.bookingDate.timeStart
      requestBooking.timeEnd = this.bookingDate.timeEnd
      updateBooking(requestBooking)
          .then(responseBooking=>{
            this.bookings[idx] = responseBooking
            this.changeDateDialogOpen = false;

          })
          .catch(error=>{
            console.log(error)
            this.changeDateError = error.message
          })
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
    &:hover{
      color: #1B77FD;
    }
  }
  .mdi{
    margin-right: 15px;
  }
  .info-panel{
    .right-side{
      width:30%;
      display: flex;
      align-items: end;
    }
    .left-side{
      width:70%;
      display: flex;
      column-gap: 50px;
      flex-wrap: wrap;
    }
  }
  .flex-column{
    span {
      font-size: 13px;
      color: #aaaab3;
    }
  }
  .dialog{
    width: 500px;
    height: 500px;
  }
  @media only screen and (max-width: 991px) {
    .right-side{
      width:100%;
    }
    .left-side{
      width:100%;
    }
    .dialog{
      width: 300px;
    }
  }
</style>