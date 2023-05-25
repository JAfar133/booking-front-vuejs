<template>
	<my-header/>
	<div class="body">
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

<style lang="scss">
@import "public/css/variables";
h1{
	font-family: $title_font;
}
body{
  overflow-x: hidden;
}
.body.paddingTop{
  padding-top:75px;
}
</style>
