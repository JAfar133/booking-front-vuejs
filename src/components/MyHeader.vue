<template>
  <div class="mobile-header">
	  <v-layout>
		  <v-app-bar
				  color="blue-darken-3"
				  density="compact"
				  scroll-behavior="collapse"
				  :elevation="11"
		  >
			  <v-menu :close-on-content-click="false" v-model="menu" transition="scale-transition">
				  <template v-slot:activator="{ props }">
					  <v-btn icon="mdi-menu" v-bind="props"></v-btn>
				  </template>

				  <v-list>
					  <v-list-item prepend-icon="mdi-home-circle" @click="$router.push('/')">
						  <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
					  <v-list-item prepend-icon="mdi-google-classroom" @click="$router.push('/rooms')">
						  <v-list-item-title>Помещения</v-list-item-title>
					  </v-list-item>
					  <v-list-group value="User" v-if="isAuthorized">
						  <template v-slot:activator="{ props }">
							  <v-list-item
									  v-bind="props"
									  prepend-icon="mdi-account-circle"
									  title="Профиль"
							  ></v-list-item>
              </template>
						  <v-list-item prepend-icon="mdi-account-edit" @click="$router.push('/me')">
							  <v-list-item-title v-if="person.firstName" >Привет, <b>{{ person.firstName }}</b></v-list-item-title>
							  <v-list-item-title v-else>Редактировать</v-list-item-title>
						  </v-list-item>
						  <v-list-item prepend-icon="mdi-format-list-text" @click="$router.push('/bookings')">
							  <v-list-item-title>Мои бронирования</v-list-item-title>
						  </v-list-item>
              <v-list-item prepend-icon="mdi-logout" @click="logout" style="background: #C7C7C7">
							  <v-list-item-title>Выйти</v-list-item-title>
						  </v-list-item>
            </v-list-group>
            <v-list-item style="background: #C7C7C7" prepend-icon="mdi-login" v-else @click="showLoginForm">
	            <v-list-item-title>Войти</v-list-item-title>
            </v-list-item>
				  </v-list>
			  </v-menu>
			  <v-app-bar-title @click="$router.push('/')"><img height="35" src="/img/logo-sevgu-footer.svg" alt=""></v-app-bar-title>
			  <template v-slot:append>
				  <v-btn icon="mdi-calendar-clock" @click="bookingButton"></v-btn>
			  </template>
		  </v-app-bar>
	  </v-layout>
  </div>
  <header class="header-section">
    <div class="top-nav bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <ul class="tn-left">
              <li><i class="fa fa-phone"></i> +7 (978) 130 0282</li>
              <li><i class="fa fa-envelope"></i> info.wolve@gmail.com</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <div class="tn-right">
              <v-btn variant="flat" color="blue-darken-1" @click="$router.push('/booking')">Забронировать сейчас</v-btn>
              <div class="top-social">
                <a href="https://www.facebook.com"><i class="fa fa-facebook"></i></a>
                <a href="#"><i class="fa fa-twitter"></i></a>
                <a href="#"><i class="fa fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menu-item">
      <div class="container">
        <div class="row">
          <div class="col-lg-2">
            <div class="logo">
              <a href="/">
                <img height="45" src="/img/logo-sevgu-footer.svg" alt="">
              </a>
            </div>
          </div>
          <div class="col-lg-10">
            <div class="nav-menu">
              <nav class="mainmenu">
                <ul>
                  <li><router-link to="/">Главная</router-link></li>
                  <li class="rooms-li"><router-link to="/rooms">Помещения</router-link></li>
                  <li v-if="!isAuthorized">
                    <v-btn @click="showLoginForm" size="small" prepend-icon="mdi-login">
                      Войти
                    </v-btn>
                  </li>
                  <li v-else><router-link to="/me" >Профиль
	                  <v-icon v-if="person.phoneNumber_confirmed" end icon="mdi-account-outline"></v-icon>
	                  <v-icon style="color:lightcoral" v-else end icon="mdi-account-alert-outline"></v-icon>
                  </router-link>
                    <ul class="dropdown">
                      <li>
                        <div v-if="person.firstName">
                          <router-link to="/me">Привет, <b>{{ person.firstName }}</b></router-link>
                        </div>
                        <div v-else >
                          <router-link to="/me">Редактировать</router-link>
                        </div>
                      </li>
                      <li><router-link to="/bookings">Мои бронирования</router-link></li>
                      <li style="background: #cfcfcf;">
                        <button class="menu-btn btn btn-link" @click="logout">
                          Выйти&nbsp;<i class="fa fa-sign-out"></i>
                        </button></li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

  </header>
	<SigninForm
			v-show="signinFormShow"
			@close="closeSigninForm"
	/>
	<LoginForm
			v-show="loginFormShow"
			@close="closeLoginForm"
			@signin="signin"
	/>
</template>

<script>
import LoginForm from "@/components/auth/loginForm.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import SigninForm from "@/components/auth/SigninForm.vue";
import { aliases, fa } from 'vuetify/iconsets/fa'
import { mdi } from 'vuetify/iconsets/mdi'

export default {
  components:{
    SigninForm,
    LoginForm
  },
  icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
          fa,
          mdi,
      },
  },
  name: "MyHeader",
  data() {
    return {
      signinFormShow: false,
      menu: false,
    }
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow'
    }),
    ...mapActions({
      deletePersonFromCookie: 'deletePersonFromCookie',
    }),

    closeLoginForm(){
      this.setLoginFormShow(false)
    },
    closeSigninForm(){
      this.signinFormShow = false;
    },
    showLoginForm() {
      this.menu=false;
      this.setLoginFormShow(true)
      document.body.classList.add('modal-open');
    },

    signin(){
      this.setLoginFormShow(false)
      this.signinFormShow = true;
      document.body.classList.add('modal-open');
    },
    logout(){
      this.deletePersonFromCookie();
      location.reload();
    },
    bookingButton(){
      this.$router.push('/booking')
    }
  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      isAuthorized: state => state.person.isAuthorized,
      loginFormShow: state => state.person.loginFormShow
    })
  }
}
</script>

<style scoped lang="scss">

ul, ol {
  padding: 0;
  margin: 0;
}

/*---------------------
  Header
-----------------------*/

.header-section.header-normal .menu-item {
  -webkit-box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
  box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
  border-bottom: 1px solid rgba(36, 11, 12, 0.5);
}
.top-nav {
  border-bottom: 1px solid #e5e5e5;
}
.top-nav .tn-left li {
  list-style: none;
  display: inline-block;
  font-size: 16px;
  color: #19191a;
  font-weight: 500;
  padding: 14px 0 12px;
  margin-right: 64px;
  position: relative;
}
.top-nav .tn-left li:after {
  position: absolute;
  right: -32px;
  top: 0;
  width: 1px;
  height: 100%;
  background: #e5e5e5;
  content: "";
}
.top-nav .tn-left li:last-child {
  margin-right: 0;
}
.top-nav .tn-left li:last-child:after {
  display: none;
}
.top-nav .tn-left li i {
  color: #216DDF;
  margin-right: 4px;
}
.top-nav .tn-right {
  text-align: right;
}
.top-nav .tn-right .top-social {
  display: inline-block;
  margin-right: 35px;
  padding: 13px 0;
}
.top-nav .tn-right .top-social a {
  display: inline-block;
  font-size: 16px;
  color: #19191a;
  margin-left: 15px;
}

.menu-item.fixed {
  position: fixed;
  top: 0;
  width:100vw;
  box-shadow: 3px 3px 15px rgba(0,0,0,.15);
}
.top-nav .tn-right .language-option img {
  height: 26px;
  width: 26px;
  border-radius: 50%;
  margin-right: 10px;
}
.top-nav .tn-right .language-option span {
  font-size: 16px;
  color: #19191a;
  text-transform: uppercase;
  font-weight: 500;
}
.top-nav .tn-right .language-option .flag-dropdown {
  position: absolute;
  left: 0;
  top: 60px;
  width: 100px;
  background: #ffffff;
  display: block;
  padding: 10px 15px;
  -webkit-box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
  box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  z-index: 99;
}
.top-nav .tn-right .language-option .flag-dropdown ul li, button {
  list-style: none;
  text-align: left;
}
.top-nav .tn-right .language-option .flag-dropdown ul li a {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 500;
  color: #19191a;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.top-nav .tn-right .language-option .flag-dropdown ul li a:hover {
  color: #216DDF;
}
.menu-item {
  position: relative;
  z-index: 6;
  width: 100vw;
  border-bottom: 1px solid rgba(36, 11, 12, 0.05);
  background: linear-gradient(90deg, rgba(10,127,205,1) 0%, rgba(10,145,223,1) 6%, rgba(255,255,255,1) 37%, rgba(255,255,255,1) 100%);

}
.menu-item .logo {
  margin-top: 18px;
}

.menu-item .nav-menu {
  text-align: right;
}
.menu-item .nav-menu .mainmenu {
  display: inline-block;
}
.menu-item .nav-menu .mainmenu li {
  list-style: none;
  display: inline-block;
  position: relative;
  z-index: 1;
}
.menu-item .nav-menu .mainmenu li.active a:after {
  opacity: 1;
}
.menu-item .nav-menu .mainmenu li:hover>a:after {
  opacity: 1;
}
.menu-item .nav-menu .mainmenu li:hover .dropdown {
  top: 77px;
  opacity: 1;
  visibility: visible;
}
.menu-item .nav-menu .mainmenu li a {
  font-size: 16px;
  color: #19191a;
  margin-right: 42px;
  font-weight: 500;
  display: inline-block;
  padding: 27px 0;
  position: relative;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  text-decoration: none;
}
.menu-item .nav-menu .mainmenu li a:after {
  position: absolute;
  left: 0;
  top: 52px;
  width: 100%;
  height: 2px;
  background: #216DDF;
  content: "";
  opacity: 0;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.tn-right {
    height:100%;
    button {
      height: 100%;
      border-radius: 0;
      margin-bottom: 5px;
      margin-right: 20px;
    }
}
.menu-item .nav-menu .mainmenu li .dropdown {
  position: absolute;
  left: 0;
  top: 97px;
  width: 180px;
  background: #ffffff;
  z-index: 9;
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-box-shadow: 0px 9px 15px rgba(25, 25, 26, 0.05);
  box-shadow: 0px 9px 15px rgba(25, 25, 26, 0.05);
}
.menu-item .nav-menu .mainmenu li .dropdown li {
  list-style: none;
  display: block;
}
.menu-item .nav-menu .mainmenu li .dropdown li a {
  font-size: 16px;
  color: #19191a;
  display: block;
  text-align: left;
  padding: 8px 15px;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}
.menu-item .nav-menu .mainmenu li .dropdown li a:hover {
  color: #216DDF;
}
.menu-item .nav-menu .mainmenu li .dropdown li a:after {
  display: none;
}

.menu-item .nav-menu .nav-right i {
  font-size: 16px;
  color: #19191a;
  cursor: pointer;
}
.canvas-open {
  display: none;
}
.offcanvas-menu-wrapper {
  display: none;
}
.dropdown button {
  color:#000;
  text-decoration: none;
  width: 100%;
}
.dropdown button:hover {
  color: #216DDF;
}

/*---------------------
  Hero
-----------------------*/

.mobile-header{
    display: none;
}

@media only screen and (max-width: 991px) {
  .header-section {
    display: none;
  }
  .mobile-header{
      display: block;
  }
  a{
      text-decoration: none;
      color: #717171;
  }
}
</style>