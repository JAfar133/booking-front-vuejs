<template>
  <transition name="success-modal" >
    <div class="modal-backdrop" >
      <div class="modal"
           :class="{ 'alert alert-success':isAuthorized }"
           role="dialog"
      >
	      <v-progress-linear
			      indeterminate
			      color="cyan"
			      v-show="loaderShow"
	      ></v-progress-linear>
        <header
            class="modal-header"
            id="modalTitle"
        >
          <h4 class="text-center">Вход</h4>
          <button
              type="button"
              class="btn-close"
              @click="close"
          >
          </button>
        </header>
        <section
            class="modal-body"
            id="modalDescription"
        >
          <div class="tabs-auth">
            <div class="tab-item" :class="{'tab-active':!phoneLogin}" @click="loginEmail">По паролю</div>
            <div class="tab-item" :class="{'tab-active':phoneLogin}" @click="loginPhone">По телефону</div>
          </div>
          <hr style="opacity: 10%">

          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div class="phone-login-form" v-if="phoneLogin">
            <div class="mb-3 text-center" v-if="!isCodeInputShow" >Мы отправим на номер SMS-сообщение с кодом подтверждения</div>
            <div>
              <label for="phone_number" >Номер телефона:</label>
              <PhoneNumberInput
                  v-model="person.phoneNumber"
                  @input="validatePhoneNumber"
                  @keydown.enter="next"
                  :disabled="isCodeInputShow"
                  :class="{
                    'is-invalid border-danger' : clientError.phoneNumber,
                    'is-valid' : !clientError.phoneNumber && person.phoneNumber
                  }"
              />
              <div v-if="isCodeInputShow" class="mt-3">
                <label for="">Введите смс код, который мы отправили вам на номер телефона</label>
                <input
                    type="text"
                    v-model="code"
                    class="form-control"
                    :class="{
                      'is-invalid border-danger' : clientError.code,
                    }"
                    @input="codeInput"
                    @keydown.enter="verify"
                >
              </div>
            </div>
          </div>


          <div class="email-login-form" v-else>
            <div class="mb-3 text-center" v-if="!isCodeInputShow" >Введите почту и пароль</div>
            <div>
              <label for="phone_number" v-if="clientError.email" :class="{'text-danger': clientError.email}">Почта:</label>
              <input
                  type="text"
                  v-model="authPerson.email"
                  class="form-control"
                  placeholder="example@mail.ru"
                  :class="{
                      'is-invalid border-danger' : clientError.email,
                      'is-valid' : !clientError.email && authPerson.email
                    }"
                  @input="validateEmail"
              >
              <p v-if="clientError.email" class="text-danger">{{ clientError.email }}</p>
              <label for="phone_number" class="mt-4" :class="{'text-danger': clientError.password}">Пароль:</label>
              <input
                  type="password"
                  v-model="authPerson.password"
                  class="form-control"
                  :class="{
                      'is-invalid border-danger' : clientError.password,
                      'is-valid' : !clientError.password && authPerson.password
                    }"
                  @input="validatePassword"
                  @keydown.enter="login"
              >
                <p v-if="clientError.password" class="text-danger">{{ clientError.password }}</p>
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          {{ smsCode ? 'Код: '+smsCode.code : '' }}
          <div class="phone-footer w-100" v-if="phoneLogin">
            <v-btn
                v-if="!isCodeInputShow"
                type="button"
                @click="next"
                variant="outlined"
                color="blue-darken-3"
            >
              Получить код
            </v-btn>
            <v-btn
                v-else
                type="button"
                @click="verify"
                variant="outlined"
                color="blue-darken-3"
            >
              Подтвердить
            </v-btn>
          </div>
          <div class="password-footer w-100" v-else>
            <v-btn

		            density="default"
                type="button"
                @click="login"
		            variant="outlined"
		            color="blue-darken-3"
            >
              Войти
            </v-btn>
          </div>
          <div class="text-center w-100">
            <div class="my-3 text-center">Или войти с помощью соцсетей</div>
            <div class="social-auth bg-light">
              <div class="social yandex" @click="yandexAuthorizated">
                <img src="/img/yandex.svg" alt="yandex" class="icon yandex">
              </div>
              <div class="social github" @click="githubAuthorizated">
                <img src="/img/github.svg" alt="github" class="icon github">
              </div>
              <div class="social google" @click="googleAuthorizated" title="Работает только с впн...">
                <img src="/img/google.svg" alt="google" class="icon google">
              </div>
              <div class="social vk" @click="vkAuthorizated">
                <img src="/img/vk.svg" alt="vk" class="icon vk">
              </div>
            </div>
            <hr style="opacity: 10%">
          </div>
          <button class="btn btn-link" @click="signin">Зарегистрироваться</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios";
import VueCookies from "vue-cookies";
import BASE_URL from '@/config.js';
export default {
  name: "loginForm",
  components: {PhoneNumberInput},
  emits: {
    close: null,
    signin: null,
  },
  data() {
    return {
      clientError: {
        phoneNumber: null,
        code: null,
        password: null,
        email: null
      },
      errorMessage:null,
      isCodeInputShow: false,
      code: null,
      authPerson: {
        email: null,
        password: null
      },
      smsCode: null,
      phoneLogin: false,
      loaderShow: false,
    }
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow',
      setAccessToken: 'setAccessToken',
      setRefreshToken: 'setRefreshToken'
    }),
    ...mapActions({
      saveTokenToCookie: 'saveTokenToCookie',
    }),
     
    yandexAuthorizated(){
      window.location=`${BASE_URL}/oauth2/authorize/yandex`;
      localStorage.setItem('currHref',window.location.pathname)
    },
    googleAuthorizated(){
      // window.location=`${BASE_URL}/oauth2/authorize/google`;
      // localStorage.setItem('currHref',window.location.pathname)
        alert('google oauth2 пока не работает')
    },
    githubAuthorizated(){
      window.location=`${BASE_URL}/oauth2/authorize/github`;
      localStorage.setItem('currHref',window.location.pathname)
    },
    vkAuthorizated(){
      // window.location=`${BASE_URL}/oauth2/authorize/vk`;
      // localStorage.setItem('currHref',window.location.pathname)
        alert('vk oauth2 пока не работает')
    },
    login(){
      this.loaderShow = true;
      this.validateEmail()
      this.validatePassword()
      if(this.clientError.email || this.clientError.password) return
      this.errorMessage = ""
      axios.post(`${BASE_URL}/auth/login/email`,this.authPerson)
          .then(response => {
            console.log("HERE")
            this.setAccessToken(response.data.access_token)
            this.setRefreshToken(response.data.refresh_token)
            this.saveTokenToCookie()
            this.close()
          })
          .catch(error=>{
            this.errorMessage = "Неверный email или пароль";
            console.log(error)
            this.loaderShow = false;
          })
    },
    signin(){
      this.$emit('signin');
    },
    close(){
      this.isCodeInputShow = false;
      this.smsCode = null;
      this.code = null;
      this.$emit('close');
    },
    loginPhone() {
      this.phoneLogin = true
    },
    loginEmail(){
      this.phoneLogin = false
    },
    validatePhoneNumber(){
      const regex = /^(\+7|7|8)?[\s-]?\(?[3489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
      if (!regex.test(this.person.phoneNumber)) {
        this.clientError.phoneNumber = 'Номер телефона введен неправильно';
      } else {
        this.clientError.phoneNumber = null;
      }
    },
    validateEmail(){
        if(this.authPerson.email === null) this.clientError.email = "обязательно"
        else if(!this.authPerson.email.includes('@')) this.clientError.email = "неверная почта"
        else this.clientError.email = null;
    },
    validatePassword(){
        if(this.authPerson.password === null) this.clientError.password = "обязательно"
        else if(this.authPerson.password.length < 8) this.clientError.password = "длина должна быть более 7 символов"
        else this.clientError.password = null;
    },
    codeInput() {
        this.clientError.code = null;
    },
    sendSmsCode() {
        this.loaderShow = true;
      axios.post(`${BASE_URL}/sms/sendSms?phoneNumber=${encodeURIComponent(this.person.phoneNumber)}`,  )
          .then((response) => {
            this.smsCode = response.data;
            this.errorMessage = '';
            this.loaderShow = false;
          })
          .catch((error) => {
            console.log(error);
            this.errorMessage = 'Error sending SMS code';
              this.loaderShow = false;
          });
    },
    verify(){
      this.loaderShow = true;
      axios.post(`${BASE_URL}/sms/verifyCode-and-auth?code=${this.code}&phoneNumber=${encodeURIComponent(this.person.phoneNumber)}` )
          .then((response) => {
            this.setAccessToken(response.data.access_token)
            this.setRefreshToken(response.data.refresh_token)
            this.saveTokenToCookie()
            this.close()
          })
          .catch((error) => {
            this.clientError.code = "Неверный код";
            console.log(error.response.data);
            this.errorMessage = error.response.data;
            this.loaderShow = false;
          });
    },
    next(){
      if(this.person.phoneNumber!==null && this.clientError.phoneNumber==null){
        this.sendSmsCode();
        this.isCodeInputShow = true;
      }
      else this.clientError.phoneNumber='Номер телефона не корректный';
    },
    savePersonIdToCookies(){
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime()+ 30 * 24 * 60 * 60 * 1000);
      VueCookies.set('userId',this.person.id);
    },
  },
  computed: {
    ...mapState({
      personId: state => state.person.personId,
      person: state => state.person.person,
      isAuthorized: state => state.person.isAuthorized,
      loginFormShow: state => state.person.loginFormShow,
    }),
  },
  mounted() {
    this.isCodeInputShow = false;
  }
}
</script>

<style scoped lang="scss">
.tabs-auth {
  margin: 25px auto;
  padding: 4px 6px;
  border-radius: 5px;
  background-color: #f4f4f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab-item {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 21px;
  color: #4d4d4d;
  border-radius: 5px;
  cursor: pointer;
  padding: 4px;
}
.tab-active {
  color: #1B77FD;
  background-color: #fff;
  box-shadow: 3px 3px 15px rgba(0,0,0,.15);
  cursor: default;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #FFFFFF;
  box-shadow: 2px 2px 20px 1px;
  border-radius: 6px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 93%;
  height: auto;
  max-height: 90vh;
  top: 50%; /* Позиционируем верхнюю границу на 50% от родителя */
  left: 50%; /* Позиционируем левую границу на 50% от родителя */
  transform: translate(-50%, -50%); /* Применяем сдвиг на -50% от размеров модального окна */

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;

    button {
      width: 100%;
      height: 50px;
    }
  }

  .modal-body {
    position: relative;
    padding: 20px 20px 40px 20px;
  }
  .phone {
    height: 50px;
    width:100%;
  }
}
  input[type="text"],  input[type="password"] {
    position: relative;
    display: block;
    width:100%;
    height: 45px;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    font-size: 16px;
    color: #19191a;
    font-weight: 500;
    padding-left: 20px;
  }
label {
  font-size: 14px;
  color: #707079;
  display: block;
  margin-bottom: 5px;
  margin-top: 15px;
}
.social-auth {
  display: flex;
  justify-content: space-around;
  background: #F8F9FA;
  padding: 15px;
}
.social:hover {
  cursor: pointer;
}

.icon{
  width:40px;
  border-radius: 5px;
  padding: 5px;

}
</style>