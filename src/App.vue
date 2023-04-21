<template>
    <router-view></router-view>
</template>

<script>
import {mapActions} from "vuex";

export default {
  methods: {
    ...mapActions({
      findPersonById: 'findPersonById',
    }),
  },
  mounted() {
    this.$nextTick(() =>{
      this.findPersonById()
    })
  },
}
</script>

<style>

</style>
