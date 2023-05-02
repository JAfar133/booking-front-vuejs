<template>
  <div>
    <div class="select mt-5">
      <div class="">
        <label>Фильтр </label>
        <vue-select
            v-model="place"
            :options="places"
            :get-option-label="(option) => optionLabel(option)"
            required
            placeholder="Выберите помещение"
            id="room"
            class="nice-select"
        />
      </div>
      <div class="mt-2">
        <div class="row">
          <div class="">
            <input type="radio" id="all" :value="false" v-model="filterPicked">
            <label for="all">Все</label>
          </div>
          <div class="">
            <input type="radio" id="confirmed" :value="true" v-model="filterPicked">
            <label for="confirmed">Только подтвержденные</label>
          </div>
        </div>
      </div>
    </div>

    <Qalendar
        :events="events"
        :config="config"
        @day-was-clicked="clickEvent"
        :is-loading="qalendarIsLoading"
        @updated-mode="updateMode"
        @interval-was-clicked="updateMode"
        @updated-period="updateMode"
    >
    </Qalendar>
  </div>
</template>

<script>
import {Qalendar} from "qalendar";
import VueSelect from "vue-select";
export default {
  name: "MyQalendar",
  props: {
    places: {
      type: Object,
      required: true
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
  components: {
    Qalendar,VueSelect
  },
  data() {
    return {
      place: null,
      filterPicked: false,
      events: [],
      dayClicked: null,
      qalendarIsLoading: false,
      config: {
        week: {
          startsOn: 'monday',
          nDays: 6,
          scrollToHour: 5,
        },
        month: {

        },
        day: {

        },
        locale: 'ru-RU',
        defaultMode: 'month',
        isSilent: true,
        showCurrentTime: true,
        dayBoundaries: {
          start: 8,
          end: 22,
        },
      }
    }
  },
  methods: {
    optionLabel(option){
      return option.name+ " на " + option.address.split(", Севастополь")[0]
    },
    eventPush(b){
        const [year, month, day] = b.date;
        const date = new Date(year, month - 1, day+1).toISOString().slice(0, 10);
        const timeStart = date+" "+b.timeStart.slice(0, 5);
        const timeEnd = date+" "+b.timeEnd.slice(0, 5);
        this.events.push({
          title: b.place.name+" на "+b.place.address,
          with: b.customer.lastName + " " +b.customer.firstName[0]+"."+b.customer.middleName[0],
          time: { start: timeStart, end: timeEnd },
          topic: !b.confirmed ? "Бронь еще не подтверждена" : "Бронь подтверждена",
          color: b.confirmed ? "red" : "blue",
          isEditable: false,
          id: b.id,
          description: "Заявка на бронирование от " + new Date(b.bookedAt).toLocaleString()
        })
    },
    clickEvent(date) {
      const currentDate = new Date();
      currentDate.setHours(0)
      if(new Date(date).getTime() >= currentDate.getTime() && new Date(date).getDay()!==0){
        this.dayClicked = date
        this.$emit('dayClicked',this.dayClicked)

      }
    },
    updateMode(){
      this.addDisabledClass()
    },
    addDisabledClass(){
        setTimeout(function() {
          const currentDate = new Date();

          const weeks = document.querySelectorAll('.calendar-month__weeks');

          weeks.forEach(function(week) {
            const weekdays = week.querySelectorAll('.calendar-month__weekday');

            weekdays.forEach(function(weekday) {
              const id = weekday.getAttribute('id');

              if (id) {
                const day = id.split('day-')[1];
                const dayDate = new Date(day);
                currentDate.setHours(0)

                if (dayDate.getTime() < currentDate.getTime() || dayDate.getDay() === 0) {
                  weekday.classList.add('disabled');
                }
              }
            });
          });
      },100);
    },
    filtered(){
      this.addDisabledClass();
      this.events=[]
        this.bookings.forEach(b=> {
          if(this.place === null || b.place.id === this.place.id){
            if(this.filterPicked === b.confirmed)
              this.eventPush(b)
            else if(!this.filterPicked){
              this.eventPush(b)
            }
          }
        });
    },
  },
  mounted() {
    this.$nextTick(() =>{
      this.qalendarIsLoading = true;
      this.addDisabledClass();
      this.qalendarIsLoading = false;
    })
  },
  watch: {
    place() {
      this.qalendarIsLoading = true;
      this.filtered()
      this.qalendarIsLoading = false;
    },
    filterPicked(){
      this.filtered()
    },
    dayClicked(newValue, oldValue) {
      const newDayId = "#day-"+newValue;
      const oldDayId = "#day-"+oldValue;
      window.$(newDayId).addClass("active");
      window.$(oldDayId).removeClass("active");

    },
    date(){
      this.dayClicked = this.date;
    },
    bookings(){
      this.events = [];
      this.bookings.forEach(b=> {
        this.eventPush(b);
      })
      this.filtered()
    }
  }
}
</script>

<style scoped>
  >>> {
    --vs-controls-color: #ebebeb;
    --vs-border-color: #ebebeb;
    --vs-line-height: 40px;
    --vs-dropdown-option-padding: 12px;
    --vs-search-input-placeholder-color: #707079;
  }
  .select {
    margin: 20px 0;
  }
  .nice-select {
    max-width: 500px;
  }
  .select div:nth-child(even) label{
    margin-left: 10px;
  }


</style>