<template>
  <v-app id="inspire">
    <nav-bar></nav-bar>
    <v-main>

      <v-container
          class="py-8 px-6"
          fluid
      >
        <v-autocomplete
            v-model="selectCustomer"
            v-model:search="search"
            :loading="loading"
            :items="customers"
            density="comfortable"
            clearable
            hide-no-data
            hide-details
            variant="underlined"
            label="Найти по ФИО заказчика"
            style="max-width: 500px; margin-bottom:20px"
        ></v-autocomplete>
        <v-row>
          <v-col cols="2">
            <v-btn size="small" @click="sortByBookedAtClick" :append-icon="sortIcon('byBookedAt')">
              Дата заказа
            </v-btn>
          </v-col>
          <v-col cols="2" class="px-4">
            <v-btn size="small" @click="sortByStatusClick" :append-icon="sortIcon('byStatus')">
              Статус
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn size="small" @click="sortByPlaceClick" :append-icon="sortIcon('byPlace')">
              Помещение
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn size="small" @click="sortByDateClick" :append-icon="sortIcon('byDate')">
              Дата бронирования
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-expansion-panels v-if="bookings.length">
            <v-expansion-panel v-for="(booking, index) in bookings">
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="2">
                    <span>{{ new Date(booking.bookedAt).toLocaleString() }}</span>
                  </v-col>
                  <v-col cols="2">
                    <div class="text-success" v-if="booking.confirmed">
                      <v-icon icon="mdi-check-outline"></v-icon>
                      Подтверждено
                    </div>
                    <div class="text-danger" v-else-if="booking.rejected">
                      <v-icon icon="mdi-delete"></v-icon>
                      Отклонено
                    </div>
                    <div v-else class="text-primary">
                      <v-icon icon="mdi-exclamation-thick"></v-icon>
                      Не подтверждено
                    </div>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start">
                    <v-icon class="mx-3" icon="mdi-map-marker-outline"></v-icon>
                    <div class="flex-column">
                      <div>{{ booking.place.name }}, {{ booking.place.address }}</div>

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
                    <template v-if="!booking.rejected">
                      <v-btn v-if="!booking.confirmed" variant="text" color="secondary" @click="confirmBooking(booking,index)">Подтвердить</v-btn>
                      <v-btn variant="text" color="danger" @click="rejectBooking(booking, index)">Отклонить</v-btn>
                      <v-btn variant="text" color="primary" @click="editBookingDate(booking,index)">Изменить дату</v-btn>
                    </template>
                    <template v-else>
                      <v-btn variant="text" color="secondary" @click="restore(booking, index)">Восстановить</v-btn>
                      <v-btn variant="text" color="danger" @click="deleteBooking(booking, index)">Удалить</v-btn>
                    </template>
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
          <h3 v-else>Пусто</h3>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {getAllBookings} from "@/api/mainApi";
import {mapState} from "vuex";
import NavBar from "@/pages/admin_page/NavBar.vue";
import moment from "moment/moment";
import {cancelBookingRejection, confirmBooking, deleteBooking, rejectBooking, updateBooking} from "@/api/adminApi";
import TimePickerInput from "@/components/UI/TimePickerInput.vue";
import DatePickerInput from "@/components/UI/DatePickerInput.vue";
import ChangeDateModal from "@/pages/admin_page/ChangeDateModal.vue";
import {sortByBookedAt, sortByDate, sortByPlace, sortByStatus} from "@/utils/bookingSort";

export default {
  components: {ChangeDateModal, DatePickerInput, TimePickerInput, NavBar},
  data() {
      return {
        bookings: [],
        constBookings: [],
        customers: [],
        loading: false,
        selectCustomer: null,
        search: null,
        date: null,
        timeStart:null,
        timeEnd:null,
        changeDateDialogOpen: false,
        bookingDate:{
          date: null,
          timeStart: null,
          timeEnd: null
        },
        changeDateError: null,
        sorts:'byBookedAt'
      };
  },
  created() {
    this.fetchBookings();
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
      getAllBookings()
          .then(data => {
            const path = this.$route.path
            switch (path){
              case '/admin':
                this.bookings = data.filter(booking=>!booking.rejected).sort(sortByBookedAt);
                break;
              case '/admin/confirmed':
                this.bookings = data.filter(booking=>booking.confirmed && !booking.rejected).sort(sortByBookedAt)
                break;
              case '/admin/unconfirmed':
                this.bookings = data.filter(booking=>!booking.confirmed && !booking.rejected).sort(sortByBookedAt)
                break;
              case '/admin/rejected':
                this.bookings = data.filter(booking=>!booking.confirmed && booking.rejected).sort(sortByBookedAt)
                break;
              default:
                this.bookings = [];
                break
            }
            this.constBookings = this.bookings;
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
    restore(booking, index){
      cancelBookingRejection(booking.id)
          .then(responseBooking=>{
            this.bookings[index] = responseBooking
          })
          .catch(error=>{
            console.log(error)
          })
    },
    deleteBooking(booking, index){
      deleteBooking(booking)
          .then(response=>{
            console.log(response)
            this.bookings.splice(index,1)
          })
          .catch(error=>{
            console.log(error)
          })
    },
    sortByDateClick(){
      this.bookings = this.bookings.sort(sortByDate)
      this.sorts = 'byDate'
    },
    sortByPlaceClick(){
      this.bookings = this.bookings.sort(sortByPlace)
      this.sorts = 'byPlace'
    },
    sortByStatusClick(){
      this.bookings = this.bookings.sort(sortByStatus)
      this.sorts = 'byStatus'
    },
    sortByBookedAtClick(){
      this.bookings = this.bookings.sort(sortByBookedAt)
      this.sorts = 'byBookedAt'
    },
    sortIcon(name){
      return name === this.sorts?'mdi-arrow-down':'';
    },
    querySelections(v) {
      this.customers = this.getCustomers.filter(e=>{
        return (e || '').toLowerCase().indexOf((v||'').toLowerCase()) > -1;
      })
    },
    filterByCustomer(){
      if(!this.selectCustomer || this.selectCustomer==='') this.bookings = [...this.constBookings]
      else {
        const bookings = this.bookings.filter(booking => this.selectCustomer === `${booking.customer.lastName} ${booking.customer.firstName} ${booking.customer.middleName}`)
        this.bookings = bookings.length ? bookings : this.constBookings
      }
    }

  },
  computed:{
    ...mapState({
      person: state => state.person.person
    }),
    getCustomers(){
      const customers = this.bookings.map(booking => `${booking.customer.lastName} ${booking.customer.firstName} ${booking.customer.middleName}`)
      return customers.filter((name, index) => {
        return customers.indexOf(name) === index;
      });
    }
  },
  watch: {
    '$route'() {
      this.fetchBookings();
      this.sorts = 'byBookedAt'
      this.selectCustomer = null
    },

    search(val){
      val && val !== this.selectCustomer && this.querySelections(val)
    },
    selectCustomer(){
      this.filterByCustomer()
    }
  },
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
      justify-content: end;
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
  .v-row{
    align-items: center;
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