<template>
  <section class="hero-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="hero-text">
            <h1>Бронирование помещений</h1>
            <p>Здесь вы можете забронировать помещения в Севастополе</p>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-1 booking">
            <BookingForm :places="places"
                         :place="place"
                         :bookings="bookings"
            />
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
    place: {
      type: Object,
      required: false
    },
    bookings: {
      type: Array,
      required: true
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');

  .hero-section {
    position: relative;
    padding-top: 60px;
    padding-bottom: 100px;

    .container {
      position: relative;
      z-index: 5;
    }
    .hero-text {
      padding-top: 170px;
      font-family: 'Alice', serif !important;
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
        font-family: 'Alice', serif !important;
      }
    }
    @media screen and (max-width: 550px) {
      .hero-text {
        h1 {

          font-size: 60px;
        }
      }
    }
    @media screen and (max-width: 400px) {
      .hero-text {
        h1 {
          font-size: 50px;
        }
      }
    }
    @media screen and (max-width: 325px) {
      .hero-text {
        h1 {
          font-size: 40px;
        }
      }
    }
  }


</style>