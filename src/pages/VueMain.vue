<template>
  <MyHeader/>
  <HeroSection :places="places" :date="date" @changeDate="changeDate"/>
  <div class="qalendar container">
    <my-qalendar :places="places" @dayClicked="dayClicked" :date="date"></my-qalendar>
  </div>
  <my-footer/>
</template>

<script>
import MyHeader from "@/components/MyHeader.vue";
import axios from 'axios'
import HeroSection from "@/components/HeroSection.vue";
import MyQalendar from "@/components/MyQalendar.vue";
import MyFooter from "@/components/MyFooter.vue";
export default {
  name: 'VueMain',
  components: {
    MyFooter,
    MyQalendar,
    HeroSection,MyHeader
  },

  data() {
    return {
      places: [],
      date: null,
      sessionPerson: null
    }
  },
  methods: {
    getRoomHalls(){
      axios.get('http://localhost:8080/roomHall')
          .then(response =>{
            this.places = response.data;
          })
          .catch(error => {
            console.log(error);
          })
    },
    dayClicked(day) {
      this.date = day;
    },
    changeDate(date){
      this.date = date
    },
  },
  mounted() {
    this.$nextTick(function (){
      this.getRoomHalls();
    });
  }
}
</script>

<style>
.qalendar {
  padding: 20px 90px;
  margin-bottom: 100px;
}
@media only screen and (max-width: 991px) {
  .qalendar {
    padding: 20px 10px;
  }
}

</style>
