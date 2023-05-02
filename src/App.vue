<template>
  <my-header/>
  <div class="py-5">
    <router-view></router-view>
  </div>
  <my-footer/>
</template>

<script>
import {mapActions} from "vuex";
import MyHeader from "@/components/MyHeader.vue";
import MyFooter from "@/components/MyFooter.vue";

export default {
  components: {MyFooter, MyHeader},
  methods: {
    ...mapActions({
      showPersonInfo: 'showPersonInfo',
      saveTokenToCookie: 'saveTokenToCookie',
    }),
    // ...mapMutations({
    //   setCustomer: 'setPerson',
    //   setPersonId: 'setPersonId',
    //   setIsAuthorized: 'setIsAuthorized',
    //   setLoginFormShow: 'setLoginFormShow',
    //   setAccessToken: 'setAccessToken',
    //   setRefreshToken: 'setRefreshToken'
    // }),
  },
  mounted() {
    this.$nextTick(() => {
      this.showPersonInfo();
    })
  },
  created() {
  }
}
</script>

<style>

</style>
