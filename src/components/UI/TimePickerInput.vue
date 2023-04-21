<template>
  <vue-date-picker
      time-picker
      mode-height="120"
      model-type="HH:mm"
      minutes-increment="30"
      :min-time="minTime"
      :max-time="maxTime"
      :start-time="minTime"
      class="date-input"
      required="required">
  </vue-date-picker>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import 'vue-select/dist/vue-select.css';

export default {
  name: "TimePickerInput",
  components: {
    VueDatePicker
  },
  data(){
    return {
      minTime: { hours: 8, minutes: 30 },
      maxTime: { hours: 22, minutes: 0 },
    }
  }
}
</script>

<style scoped>

</style>