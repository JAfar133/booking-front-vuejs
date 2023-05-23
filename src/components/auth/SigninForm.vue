<template>
  <transition name="fade-transition">
    <div class="modal-backdrop" @click.prevent="close">
      <div class="modal"
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
          <h4 class="text-center">Регистрация</h4>
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

          <v-alert v-if="errorMessage"
                   type="warning"
                   variant="tonal"
                   class="mt-4">
            <span> {{ errorMessage }}</span>
          </v-alert>
            <div>
              <label for="phone_number" >Номер телефона:</label>
              <PhoneNumberInput
                  v-model="person.phoneNumber"
                  @input="validatePhoneNumber"
                  :class="{
                    'is-invalid border-danger' : clientError.phoneNumber,
                    'is-valid' : !clientError.phoneNumber && person.phoneNumber
                  }"
              />
            </div>
            <div>
              <label for="email" >Почта:</label>
              <input
                  type="text"
                  v-model="person.email"
                  class="form-control"
                  placeholder="example@mail.ru"
                  if="email"
                  :class="{
                      'is-invalid border-danger' : clientError.email,
                      'is-valid' : !clientError.email && person.email
                    }"
                  @input="validateEmail"
              >
              <label for="password" class="mt-4">Придумайте пароль:</label>
              <input
                  type="password"
                  v-model="person.password"
                  class="form-control"
                  id="password"
                  :class="{
                      'is-invalid border-danger' : clientError.password,
                      'is-valid' : !clientError.password && person.password
                    }"
                  @input="validatePassword"
              >
            </div>
        </section>
        <footer class="modal-footer">

          <div class="password-footer w-100">
            <v-btn
                type="button"
                @click="signup"
                variant="outlined"
                color="blue-darken-3"
                :loading="loaderShow"
            >
              Зарегистрироваться
            </v-btn>
          </div>

        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import axios from "axios";
import {mapActions, mapMutations} from "vuex";
import BASE_URL from '@/config.js';
import {signUp} from "@/api/authApi";
export default {
  name: "SigninForm",
  components: {
    PhoneNumberInput
  },
  emits: {
    close: null,
  },
  data() {
    return {
      person:{
        email: null,
        phoneNumber: null,
        password: null
      },
      clientError: {
        email: null,
        phoneNumber: null,
        password: null,
      },
      errorMessage: null,
      loaderShow: false,
    }
  },
  methods:{
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
    signup(){
      this.validatePhoneNumber();
      this.validateEmail();
      this.validatePassword();
      if(this.hasError()) return
      this.loaderShow = true;
      signUp(this.person)
          .then(()=>{
            this.close()
          })
          .catch(error=>{
            console.log(error)
            this.errorMessage = error;
            this.loaderShow = false;
          })
    },
    hasError() {
        for (const key in this.clientError) {
            if (this.clientError[key] !== null && this.clientError[key] !== undefined) {
                return true;
            }
        }
        return false;
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
        if(this.person.email === null) this.clientError.email = "обязательно"
        else if(!this.person.email.includes('@')) this.clientError.email = "неверная почта"
        else this.clientError.email = null;
    },
    validatePassword(){
        if(this.person.password === null) this.clientError.password = "обязательно"
        else if(this.person.password.length < 8) this.clientError.password = "длина должна быть более 7 символов"
        else this.clientError.password = null;
    },
    close(){
      this.$emit('close')
      document.body.classList.remove('modal-open');
    }
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
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
  max-height: 80vh;
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
@media only screen and (max-width: 600px) {
  .modal {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: 100%;
    padding: 0;
    z-index: 1054;
  }
}
</style>