<template>

</template>
<script>
import {defineComponent} from 'vue'
import DatePickerInput from "@/components/UI/DatePickerInput.vue";
import TimePickerInput from "@/components/UI/TimePickerInput.vue";

export default defineComponent({
  name: "ChangeDateModal",
  components: {TimePickerInput, DatePickerInput},
  props: {
    dialogIsOpen:Boolean,
  }
})
</script>


<style scoped>

</style>