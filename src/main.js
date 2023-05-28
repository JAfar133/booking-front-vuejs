import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue'
import store from '@/store'
import "bootstrap/dist/css/bootstrap.min.css";
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css'; // импорт стилей Vue Select
import 'qalendar/dist/style.css'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import './utils/waveAndHeaderScrollAnimation'
import '/public/css/style.css'
loadFonts()
window.$ = require('jquery')
window.JQuery = require('jquery')

import VueCarousel from "@chenfengyuan/vue-carousel";
import router from "@/router/router";


const app = createApp(App)
app.component('vue-select',VueSelect);
app.component(VueCarousel.name,VueCarousel)
app.use(store)
    .use(VueRouter)
    .use(router)
    .use(vuetify)
    .use(VueCookies, { expires: '7d' })
    .mount('#app')





