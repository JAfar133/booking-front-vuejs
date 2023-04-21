<template>
  <vue-date-picker
      id="date-in"
      locale="ru"
      :format="format"
      :enable-time-picker="false"
      month-name-format="long"
      model-type="yyyy-MM-dd"
      :min-date="new Date()"
      :disabled-week-days="[7, 0]"
      auto-apply
      required
      placeholder="Выберите дату"
      class="date-input"
      autocomplete="off"
      >
  </vue-date-picker >
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import 'vue-select/dist/vue-select.css';

export default {
  name: "DatePickerInput",
  components: {
    VueDatePicker
  },
  data(){
    return {
      format: "dd MMMM, yyyy",
    }
  }
}
</script>

<style scoped>

</style>