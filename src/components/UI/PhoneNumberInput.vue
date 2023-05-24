<template>
  <input type="text"
         :value="modelValue"
         @input="updateInput"
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
      const unmaskedValue = this.$refs.phoneInput.inputmask.unmaskedvalue();
      const formattedValue = `+7${unmaskedValue}`;
      this.$emit("update:modelValue", formattedValue);
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