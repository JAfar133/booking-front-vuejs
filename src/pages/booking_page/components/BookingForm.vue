<template>
  <div class="booking-form" id="booking-form" tabindex="0">
    <slot name="booking-form-header"></slot>
    <form action="/public"
          id="validationForm"
          method="post"
          @submit.prevent="valid"

    >
      <div class="">
        <label for="date-in">Дата:</label>
        <date-picker-input v-model="booking.date" :markers="markers"/>
      </div>
      <div class="check-date">
        <label for="time-start">Начало:</label>
        <time-picker-input
            v-model="booking.timeStart"
            placeholder="Выберите время начала"
        />
      </div>
      <div class="check-date">
        <label for="time-end">Конец:</label>
        <time-picker-input
            v-model="booking.timeEnd"
            placeholder="Выберите время окончания"
        />
      </div>
      <div class="select-option">
        <label for="room">Помещение:</label>
        <vue-select
            v-model="booking.place"
            :options="places"
            :get-option-label="(option) => optionLabel(option)"
            required
            placeholder="Выберите помещение"
            id="room"
            class="nice-select"
        />
        <v-alert v-if="bookingError.length"
                 type="warning"
                 variant="tonal"
                 class="mt-4">
	        <span :key="error.length" v-for="error in bookingError"> {{ error }}</span>
        </v-alert>

      </div>
      <v-btn type="submit" id="booking-submit-btn" class="btn btn-primary" :loading="loaderShow">
        <slot name="booking-from-button-text">Забронировать</slot>
      </v-btn>
	    <v-progress-linear
			    indeterminate
			    color="cyan"
			    v-show="loaderShow"
	    ></v-progress-linear>
    </form>

    <success-modal v-show="successModal" @close="closeSuccessModal">
      Ваша заявка будет рассмотрена в ближайшее время
    </success-modal>

    <change-phone-modal
        v-show="verifyPhoneNumber"
        @close="verifyPhoneNumber=false"
    />

  </div>

</template>

<script>
import VueSelect from 'vue-select';
import DatePickerInput from "@/components/UI/DatePickerInput.vue";
import TimePickerInput from "@/components/UI/TimePickerInput.vue";
import SuccessModal from "@/pages/booking_page/components/SuccessModal.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import ChangePhoneModal from "@/components/auth/ChangePhoneModal.vue";
import axios from 'axios'
import {ref} from 'vue'
import {mapMutations, mapState} from "vuex";
import BASE_URL from '@/config.js';

export default {

  components:{
    TimePickerInput, SuccessModal, ChangePhoneModal,
    VueSelect,
    DatePickerInput
  },
  name: "BookingForm",
  emits: {
    bookingIsValid: null
  },
  props: {
    places: {
      type: Object,
      required: true
    },
    place: {
      type: Object,
      required: false
    },
    bookings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      bookingError: '',
      successModal: ref(false),
      markers: [],
      verifyPhoneNumber: false,
      loaderShow: false,
    }
  },

  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow',
      setBooking: 'setBooking'
    }),
    optionLabel(option){
      return option.name+ " на " + option.address.split(", Севастополь")[0]
    },

    closeSuccessModal(){
      this.successModal = false;
    },
    getNormalizedDate(date){
      return new Date(date[0], date[1] - 1, date[2] + 1).toISOString().slice(0, 10)
    },
    async valid(){
      this.loaderShow = true;
      this.bookingError = []
      axios.post(`${BASE_URL}/booking/valid-booking`, this.booking)
          .then(() =>{
              this.$emit('bookingIsValid')
              this.loaderShow = false;
          })
          .catch(error => {
            console.log(error)
            this.bookingError.push(error.response.data)
            this.loaderShow = false;
          })
    },
    async submitBooking(customer, comment){
      this.bookingError = []
      this.booking.customer = customer;
      this.booking.comment = comment;
      axios.post(`${BASE_URL}/booking/save`, this.booking,
          {
            headers: {
              'Authorization': 'Bearer ' + this.access_token
            }
          }
      )
          .then((response) =>{
            this.booking.date = this.getNormalizedDate(response.data.date)
            this.successModal = true;
          })
          .catch(error => {
            console.log(error)
            this.bookingError.push(error.response.data)
          })
    },
    pushMarker(booking) {
        const normalizedDate = this.getNormalizedDate(booking.date);
        const timeStart = booking.timeStart.substring(0, 5);
        const timeEnd = booking.timeEnd.substring(0, 5);
        const address = booking.place.address.includes('Курчатова') ? "Курчатова" : "Гоголя";
        const marker = {
            date: normalizedDate,
            type: 'line',
            tooltip: [{
                text: booking.place.name + ", " + address + " [" + timeStart + "-" + timeEnd + "]",
                color: booking.confirmed ? "red" : "blue"
            }],
            color: booking.confirmed ? "red" : "blue"
        };
        const existingMarker = this.markers.find(m => m.date === normalizedDate);
        if (existingMarker) {
            existingMarker.tooltip.push(marker.tooltip[0]);
            if (booking.confirmed) {
                existingMarker.color = "red";
            }
        } else {
            this.markers.push(marker);
        }
    }
  },
  mounted() {
    this.$nextTick(() =>{
      if(this.markers.length===0){
        this.bookings.forEach(b=>this.pushMarker(b));
      }
      const booking = JSON.parse(localStorage.getItem('booking'));
      booking && this.setBooking(booking);
    })
  },
  computed: {
    // personDetailsModal() {
    //   return personDetailsModal
    // },
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      isAuthorized: state => state.person.isAuthorized,
      loginFormShow: state => state.person.loginFormShow,
      access_token: state => state.person.access_token,
      booking: state => state.booking.booking
    }),
  },
  watch: {
    place(){
      this.booking.place = this.place
    },
    bookings(){
      this.bookings.forEach(b=>this.pushMarker(b));
    }
  },

}
</script>

<style scoped>

  .booking-form {
    background: #ffffff;
    padding: 44px 40px 50px 40px;
    border-radius: 4px;
    z-index: 1;
  }
  .booking-form h3 {
    color: #19191a;
    margin-bottom: 36px;
  }

  .booking-form label {
    font-size: 14px;
    color: #707079;
    display: block;
    margin-bottom: 5px;
    margin-top: 15px;
  }
  .booking-form .check-date i {
    color: #216DDF;
    position: absolute;
    right: 18px;
    bottom: 17px;
  }
  .booking-form .select-option {
    margin-bottom: 15px;
  }

  >>> {
    --vs-controls-color: #ebebeb;
    --vs-border-color: #ebebeb;
    --vs-line-height: 40px;
    --vs-dropdown-option-padding: 12px;
    --vs-search-input-placeholder-color: #707079;

  }

  .booking-form button {
    display: block;
    font-size: 14px;
    text-transform: uppercase;
    border: 1px solid #216DDF;
    border-radius: 2px;
    color: #216DDF;
    font-weight: 500;
    background: transparent;
    width: 100%;
    height: 46px;
    margin-top: 30px;
  }

</style>