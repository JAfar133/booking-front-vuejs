<template>
  <div class="booking-form" id="booking-form" tabindex="0">
    <h3>Бронирование помещений </h3>
    <p>Пожалуйста выберите дату, время и место бронирования</p>
    <form action="/"
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
        <div v-if="bookingError.length && !showModal" class="alert alert-danger mt-2">
          <span :key="error.length" v-for="error in bookingError"> {{ error }}</span>
        </div>

      </div>
      <input type="submit" id="booking-submit-btn" class="btn btn-primary" value="Продолжить"/>
    </form>

    <success-modal v-show="successModal" @close="closeSuccessModal">
      Ваша заявка будет рассмотрена в ближайшее время
    </success-modal>

<!--    <person-details-modal-->
<!--      v-show="showModal"-->
<!--      @personDetailsModalClose="closePersonDetailsModal"-->
<!--      @submitBooking="submitBooking"-->
<!--      @verifyPhoneNumber="verifyPhoneNumber=true"-->
<!--      :bookingError="bookingError"-->
<!--    />-->
    <change-phone-modal
        v-show="verifyPhoneNumber"
        @close="verifyPhoneNumber=false"
    />
  </div>
</template>

<script>
import VueSelect from 'vue-select';
// import PersonDetailsModal from "@/components/PersonDetailsModal.vue";
import personDetailsModal from "@/components/PersonDetailsModal.vue";
import DatePickerInput from "@/components/UI/DatePickerInput.vue";
import TimePickerInput from "@/components/UI/TimePickerInput.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import ChangePhoneModal from "@/components/ChangePhoneModal.vue";
import axios from 'axios'
import {ref} from 'vue'
import {mapMutations, mapState} from "vuex";


export default {
  computed: {
    personDetailsModal() {
      return personDetailsModal
    },
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      isAuthorized: state => state.person.isAuthorized,
      loginFormShow: state => state.person.loginFormShow,
      access_token: state => state.person.access_token,
      booking: state => state.booking.booking
    }),
  },
  components:{
    TimePickerInput, SuccessModal, ChangePhoneModal,
    VueSelect,
    // PersonDetailsModal,
    DatePickerInput
  },
  name: "BookingForm",
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
      showModal: ref(false),
      bookingError: '',
      successModal: ref(false),
      markers: [],
      verifyPhoneNumber: false
    }
  },
  mounted() {
    this.$nextTick(() =>{
      if(this.markers.length===0){
        this.bookings.forEach(b=>this.pushMarker(b));
      }
    })
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow'
    }),
    optionLabel(option){
      return option.name+ " на " + option.address.split(", Севастополь")[0]
    },
    closePersonDetailsModal() {
      this.showModal = false;
    },
    closeSuccessModal(){
      this.successModal = false;
    },
    getNormalizedDate(date){
      return new Date(date[0], date[1] - 1, date[2] + 1).toISOString().slice(0, 10)
    },
    async valid(){
      this.bookingError = []
      axios.post('http://localhost:8080/booking/valid-booking', this.booking)
          .then(() =>{
              this.showModal = true;
          })
          .catch(error => {
            console.log(error)
            this.bookingError.push(error.response.data)
          })
    },
    async submitBooking(customer, comment){
      this.bookingError = []
      this.booking.customer = customer;
      this.booking.comment = comment;
      axios.post('http://localhost:8080/booking/save', this.booking,
          {
            headers: {
              'Authorization': 'Bearer ' + this.access_token
            }
          }
      )
          .then((response) =>{
            this.booking.date = this.getNormalizedDate(response.data.date)
            this.showModal = false;
            this.successModal = true;
          })
          .catch(error => {
            console.log(error)
            this.bookingError.push(error.response.data)
          })
    },
    pushMarker(booking){
      const normalizedDate = this.getNormalizedDate(booking.date)
      let isContain = false;
      const timeStart = booking.timeStart.substring(0,5);
      const timeEnd = booking.timeEnd.substring(0,5);
      let address = booking.place.address.includes('Курчатова') ? "Курчатова" : "Гоголя";
      this.markers.forEach(m=>{
        if(m.date === normalizedDate){
          m.tooltip.push({text: booking.place.name +", "+ address + " ["+timeStart+"-"+timeEnd+"]"
            , color: booking.confirmed ? "red" : "blue"})
          if(booking.confirmed) m.color = "red"
          isContain = true;
        }
      })
      if(!isContain){
        this.markers.push({
          date: this.getNormalizedDate(booking.date),
          type: 'line',
          tooltip: [{text: booking.place.name+", "+ address + " ["+timeStart+"-"+timeEnd+"]"
            , color: booking.confirmed ? "red" : "blue"},],
          color: booking.confirmed ? "red" : "blue"
        })
      }
    },
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
  @import "vue-select/dist/vue-select.css";

  .booking-form {
    width: 600px;
    background: #ffffff;
    padding: 44px 40px 50px 40px;
    border-radius: 4px;
    border: 2px solid rgba(119,221,231,0.5);;
    z-index: 7;
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

  .booking-form input[type="submit"] {
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

  @media only screen and (max-width: 1510px) {
    .booking-form {
      width:500px;
    }
  }
  @media only screen and (max-width: 991px) {
    .booking-form {
      width:auto;
    }
  }
</style>