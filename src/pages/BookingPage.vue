<template>
  <div class="bg-light">
    <div class="booking container">
        <person-details
                :booking-error="''"
                class="person-details"
                ref="PersonDetails"
        ></person-details>
        <BookingForm :bookings="bookings"
                     :places="places"
                     class="booking-form"
                     @bookingIsValid="submitBooking"
        ></BookingForm>
    </div>
  </div>
    <change-phone-modal
            v-show="changePhoneNumber"
            @close="changePhoneNumber=false"
    />
	<v-dialog
			transition="dialog-top-transition"
			width="auto"
			v-model="successModal"
	>
		<template v-slot:default="{ isActive }">
			<v-card>
				<v-toolbar
						color="primary"
						title="Успешно"
				></v-toolbar>
				<v-card-text>
					<div class="">Мы свяжемся с вами для подтверждения бронирования!</div>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn
							variant="text"
							@click="close"
					>Ок!</v-btn>
				</v-card-actions>
			</v-card>
		</template>
	</v-dialog>
</template>

<script>

import BookingForm from "@/components/BookingForm.vue";
import PersonDetails from "@/components/PersonDetails.vue";
import { getRoomHalls, getBookings } from '@/mainApi';
import {mapMutations, mapState} from "vuex";
import axios from "axios";
import ChangePhoneModal from "@/components/ChangePhoneModal.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import BASE_URL from '@/config.js';
export default {
  name: "BookingPage",
  components: {
      SuccessModal,
      ChangePhoneModal,
    BookingForm,
    PersonDetails
  },
  data() {
    return {
      places: [],
      sessionPerson: null,
      bookings: [],
      place: null,
      changePhoneNumber: false,
      successModal: false
    }
  },
  methods: {
    ...mapMutations({
        setLoginFormShow: 'setLoginFormShow'
    }),
    close(){
      this.successModal = false;
      window.location.href="/";
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
    async submitBooking(){
      const isValid = this.$refs.PersonDetails.personDetailsIsValid()
        console.log(isValid)
        console.log(this.isAuthorized)
      if(isValid){
        if(!this.isAuthorized) this.setLoginFormShow(true)
        else if(!this.person.phoneNumber_confirmed) this.changePhoneNumber = true
        else {
          this.setCustomer(this.person)
          axios.post(`${BASE_URL}/booking/save`, this.booking,
              {
                headers: {
                  'Authorization': 'Bearer ' + this.access_token
                }
              }
          )
              .then((response) =>{
                console.log(response);
                localStorage.removeItem("booking");
                this.successModal = true;
                // window.location.href="/";
              })
              .catch(error => {
                console.log(error)
              })
        }
      }
    },
    ...mapMutations({
      setBooking: 'setBooking',
      setCustomer: 'setCustomer'
    })
  },
  mounted() {
    this.$nextTick(function (){
      this.getRoomHalls();
      this.getBookings();
      const booking = JSON.parse(localStorage.getItem('booking'));
      booking && this.setBooking(booking);
    });
  },
  computed: {
    ...mapState({
      person: state => state.person.person,
      booking: state => state.booking.booking,
      access_token: state => state.person.access_token,
      isAuthorized: state => state.person.isAuthorized

    })
  }
}
</script>

<style scoped>
  .booking-form {
    width: 450px;
    max-width: 100%;
    height: 100%;
    padding: 25px 25px 50px;
  }
  .person-details{
      margin-right: 40px;
      width: 700px;
      max-width: 100%;
  }
  .booking{
    padding-top: 70px;
      padding-bottom: 40px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  @media only screen and (max-width: 991px) {
      .booking-form {
          padding: 25px 25px 50px;
      }
  }
</style>