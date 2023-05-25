<template>
  <transition name="fade-transition">
    <div class="modal-backdrop overflow-hidden" @click.prevent="close">
      <div class="modal"
           :class="{ 'alert alert-success':isAuthorized }"
           role="dialog"
           @click.stop
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

          <v-alert v-if="errorMessage"
                   type="warning"
                   variant="tonal"
                   class="my-5">
            <span> {{ errorMessage }} </span>
          </v-alert>
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
                <div class="code-inputs">
                  <template :key="input.id" v-for="input in inputs">
                    <input
                        type="tel"
                        :ref="input.id"
                        v-model="input.value"
                        :id="input.id"
                        @keydown="inputKeyDown"
                        @input="codeInput"
                        :class="{'danger': clientError.code}"
                        @paste="pasteCode"
                    >
                  </template>
                </div>
                <div class="mt-4 text-danger text-center" v-if="clientError.code"
                >{{ clientError.code }}</div>
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
                :loading="loaderShow"
            >
              Получить код
            </v-btn>
            <v-btn
                v-else
                type="button"
                @click="verify"
                variant="outlined"
                color="blue-darken-3"
                :loading="loaderShow"
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
		            :loading="loaderShow"
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
import BASE_URL from '@/config.js';
import {loginByEmail, verifyAndAuth} from "@/api/authApi";
import {sendSms} from "@/api/personApi";

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
      errorMessage: null,
      isCodeInputShow: false,
      code: null,
      authPerson: {
        email: null,
        password: null
      },
      smsCode: null,
      phoneLogin: false,
      loaderShow: false,
      inputs:[
        {id:"1",value:""},
        {id:"2",value:""},
        {id:"3",value:""},
        {id:"4",value:""},
        {id:"5",value:""},
        {id:"6",value:""},
      ],
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
    githubAuthorizated(){
      window.location=`${BASE_URL}/oauth2/authorize/github`;
      localStorage.setItem('currHref',window.location.pathname)
    },
    googleAuthorizated(){
      // window.location=`${BASE_URL}/oauth2/authorize/google`;
      // localStorage.setItem('currHref',window.location.pathname)
        alert('google oauth2 пока не работает')
    },
    vkAuthorizated(){
      // window.location=`${BASE_URL}/oauth2/authorize/vk`;
      // localStorage.setItem('currHref',window.location.pathname)
        alert('vk oauth2 пока не работает')
    },
    login(){
      this.validateEmail();
      this.validatePassword();
      if(this.clientError.email || this.clientError.password) return;
      this.errorMessage = null;
      this.loaderShow = true;
      loginByEmail(this.authPerson)
          .then(()=> {
            this.close()
          })
          .catch((error)=>{
            this.errorMessage = error;
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
      document.body.classList.remove('modal-open');
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
    sendSmsCode() {
        this.loaderShow = true;
        sendSms(this.person.phoneNumber)
            .then((smsCode)=>{
              setTimeout(()=>{
                alert(`Ваш код из СМС: ${smsCode.code}`)
                this.smsCode = smsCode;
                document.getElementById("1").focus();
              },500)

              this.loaderShow = false;
              this.isCodeInputShow = true;
              this.errorMessage = null;
            })
            .catch((error)=>{
              this.errorMessage = error;
              this.loaderShow = false
            })
    },
    verify(){
      this.loaderShow = true;
      verifyAndAuth(this.code, this.person.phoneNumber)
          .then((response)=> {
            console.log(response)
            this.close()
          })
          .catch(error=>{
            console.log(error)
            this.clientError.code = "Неверный код"
            this.loaderShow = false;
          })
    },
    next(){
      if(this.person.phoneNumber!==null && this.clientError.phoneNumber==null){
        this.sendSmsCode();

      }
      else this.clientError.phoneNumber='Номер телефона не корректный';
    },
    inputKeyDown(event){
      const inputId = Number(event.target.id)
      if (event.keyCode === 8) {
        if(inputId>1){
          if(this.inputs[inputId-1].value!==""){
            this.inputs[inputId-1].value=""
          }
          else document.getElementById(String(inputId-1)).focus();
        }
      }
      if(event.keyCode === 37){
        if(inputId>0){
          document.getElementById(String(inputId-1)).focus();
        }
      }
      if(event.keyCode === 39){
        if(inputId<6){
          document.getElementById(String(inputId+1)).focus();
        }
      }
    },
    codeInput(input){
      const value = input.target.value;
      const id = Number(input.target.id);

      this.inputs[id-1].value = this.inputs[id-1].value.slice(0,1)
      if(isNaN(value)){
        this.inputs[id-1].value = value.replace(/\D/g, '');
      }
      if(this.inputs[id-1].value!=="" && id!==6){
        document.getElementById(String(id+1)).focus();
      }
      let count = 0;
      let code = '';
      for(input of this.inputs){
        if(input.value!=="") {
          count++;
          code+=input.value;
        }
      }
      if(count===6){
        this.code = code;
        this.verify();
      }
      else {
        count = 0;
        code = '';
      }
    },
    pasteCode(event){
      const inputId = Number(event.target.id);
      const inputData = event.clipboardData.getData('text/plain');
      let pos = 0;
      for (let i = inputId-1; i < inputData.length+inputId-1; i++) {
        this.inputs[i].value = inputData.slice(pos,pos+1)
        document.getElementById(String(i+1)).focus();
        pos++;
      }
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
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
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
.code-inputs{
  display: flex;
  column-gap: 10px;
  justify-content: center;
  margin-top: 30px;
  input{
    font-size: 25px;
    padding-left: 0;
    padding-right: 0;
    text-align: center;
    border: none;
    border-bottom: 2px solid #aaaab3;
    width:40px;
  }
  input.danger{
    border-bottom: 2px solid #DA0916;
  }
}
@media only screen and (max-width: 600px) {
  .modal {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: 100%;
    padding: 0;
    z-index: 1000;
  }
}
</style>