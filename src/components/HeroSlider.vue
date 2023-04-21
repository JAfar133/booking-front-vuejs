<template>

  <div class="slider-container">
    <vue-carousel :data="data" :autoplay="true" class="hero-slider"></vue-carousel>
  </div>

</template>

<script>
import VueCarousel from '@chenfengyuan/vue-carousel';
export default {
  components: {
    VueCarousel
  },
  name: "HeroSlider",
  data() {
    return {
      data: [
        '<div class="slide" ><img class="hero-img" src="/img/hero/hero-2.jpg" alt=""></div>',
        '<div class="slide" ><img class="hero-img" src="/img/hero/hero-3.jpg" alt=""></div>',
      ],
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped>
  .slider-container {
    height: 100%;
    left: 0;
    top: 0;
    display: block;
    position: absolute;
  }

</style>