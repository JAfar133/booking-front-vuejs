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
            @close="closeConfirmModal"
    >Подтвердите номер телефона</change-phone-modal>
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

import BookingForm from "@/pages/booking_page/components/BookingForm.vue";
import PersonDetails from "@/pages/booking_page/components/PersonDetails.vue";
import { getRoomHalls, getBookings } from '@/api/mainApi';
import {mapMutations, mapState} from "vuex";
import ChangePhoneModal from "@/components/auth/ChangePhoneModal.vue";
import SuccessModal from "@/pages/booking_page/components/SuccessModal.vue";
import {submitBooking} from "@/api/personApi";
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

				if(isValid){
					if(!this.isAuthorized) {
            this.setLoginFormShow(true)
            document.body.classList.add('modal-open');
          }
					else if(!this.person.phoneNumber_confirmed) this.changePhoneNumber = true
					else {
						this.setCustomer(this.person)
						submitBooking(this.booking).then((data)=>{
							localStorage.removeItem("booking")
							this.successModal = true;
						}).catch(error=>{
              console.log(error)
            })
					}
				}
    },
    closeConfirmModal(){
      this.changePhoneNumber = false;
      if(this.person.phoneNumber_confirmed){
        this.submitBooking();
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