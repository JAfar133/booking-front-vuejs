<template>
  <section class="hero-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="hero-text">
            <h1>Бронирование помещений</h1>
            <p>Здесь вы можете забронировать помещения в Севастополе!</p>
          </div>
        </div>
        <div class="col-md-5 offset-lg-1 booking">
            <BookingForm :places="places"
                         :place="place"
                         :bookings="bookings"
                         class="booking-form"
                         @bookingIsValid="$emit('bookingIsValid')"
            >
              <template v-slot:booking-form-header>
                <h3>Бронирование помещений </h3>
                <p>Пожалуйста выберите дату, время и место бронирования</p>
              </template>
              <template v-slot:booking-from-button-text>
                Продолжить
              </template>
            </BookingForm>
        </div>
      </div>
    </div>
    <HeroSlider/>
  </section>
  <!-- Hero Section End -->
</template>

<script>
import BookingForm from "@/components/BookingForm.vue";
import HeroSlider from "@/components/HeroSlider.vue";
export default {
  name: "HeroSection",
  components: {
    BookingForm,HeroSlider
  },
  emits: {
    bookingIsValid: null,
  },
  props:{
    places: {
      type: Object,
      required:true
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
  data(){
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

  .hero-section {
    position: relative;
    padding-top: 60px;
    padding-bottom: 100px;
    .booking-form{
      width: 600px;
    }
    .container {
      position: relative;
      z-index: 5;
    }
    .hero-text {
      padding-top: 170px;
      h1 {
        font-size: 85px;
        line-height: 90px;
        color: #fff;
        margin-bottom: 16px;
      }
      p {
        font-size: 22px;
        color: #fff;
        line-height: 28px;
        margin-bottom: 35px;
        margin-top: 30px;
      }
    }
    @media only screen and (max-width: 1470px) {
      .hero-text {
        h1 {
          font-size: 60px;
        }
      }
      .booking-form {
        width:450px;
      }
    }
    @media only screen and (max-width: 1200px) {
      .hero-text {
        h1 {

          font-size: 60px;
        }
      }
      .booking-form {
        width:200px;
      }
    }
    @media only screen and (max-width: 991px) {
      .hero-text {
        h1 {
          font-size: 50px;
        }
      }
      .booking-form {
        width:100%;
      }
      .booking {
        width:100%;
      }
    }
    @media only screen and (max-width: 550px) {
      .hero-text {
        h1 {
          font-size: 45px;
        }
        p{
          font-size: 16px;
          margin-top: 0;
        }
      }
    }
    @media only screen and (max-width: 400px) {
      .hero-text {
        h1 {
          font-size: 44px;
        }
        p {
          font-size: 16px;
        }
      }
    }
    @media only screen and (max-width: 325px) {
      .hero-text {
        h1 {
          font-size: 40px;
        }
      }
    }
  }


</style>