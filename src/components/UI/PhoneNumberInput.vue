<template>
  <input type="text"
         :value="modelValue"
         @input="updateInput"
         id="phone_number"
         ref="phoneInput"
         class="form-control"
         autocomplete="off"
         required
         placeholder="+7"
  />
</template>

<script>
import Inputmask from "inputmask";

export default {
  name: "PhoneNumberInput",
  props: {
    modelValue: {
      type: String
    }
  },
  methods: {
    updateInput() {
      const unmaskedValue = this.$refs.phoneInput.inputmask.unmaskedvalue(); // получаем значение без маски
      const formattedValue = `+7${unmaskedValue}`; // добавляем префикс +7 к значению без маски
      this.$emit("update:modelValue", formattedValue); // эмитируем событие с отформатированным значением
    }

  },
  mounted() {
    Inputmask({
      mask: '+7 (999) 999-99-99',
      showMaskOnHover: true,
      showMaskOnFocus: true,

    }).mask(this.$refs.phoneInput);
  }
}
</script>

<style scoped>

</style>