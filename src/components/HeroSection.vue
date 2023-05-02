<template>
  <section class="hero-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="hero-text">
            <h1>Бронирование помещений</h1>
            <p>Здесь вы можете забронировать помещения в севастополе</p>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-1 booking">
            <BookingForm :places="places" :date="date" :bookings="bookings" @changeDate="$emit('changeDate',$event)"/>
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
  props:{
    places: {
      type: Object,
      required:true
    },
    date: {
      type: String,
      required: false
    },
    bookings: {
      type: Array,
      required: true
    }
  },
  methods: {
    changeDate(date){
      console.log(date);
    }
  }
}
</script>

<style scoped>
  .hero-section {
    position: relative;
    padding-top: 60px;
    padding-bottom: 100px;
  }
  .hero-section .container {
    position: relative;
    z-index: 5;
  }
  .hero-text {
    padding-top: 145px;
  }
  .hero-text h1 {
    font-size: 80px;
    line-height: 90px;
    color: #ffffff;
    margin-bottom: 16px;
  }
  .hero-text p {
    font-size: 18px;
    color: #ffffff;
    line-height: 28px;
    margin-bottom: 35px;
  }
  @media only screen and (max-width: 550px) {
    .hero-text h1 {
      font-size: 60px;
    }
  }
  @media only screen and (max-width: 400px) {
    .hero-text h1 {
      font-size: 50px;
    }
  }
  @media only screen and (max-width: 325px) {
    .hero-text h1 {
      font-size: 40px;
    }
  }
</style>