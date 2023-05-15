<template>
  <transition name="success-modal">
    <div class="modal-backdrop">
      <div class="modal"
           :class="{ 'alert alert-success':isAuthorized }"
           role="dialog"
      >
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
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
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
            <button
                type="button"
                class="btn btn-outline-primary"
                @click="signup"
            >
              Зарегистрироваться
            </button>
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
      errorMessage: null
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
      axios.post('http://localhost:8080/auth/signin',this.person)
          .then(response=>{
            this.setAccessToken(response.data.access_token)
            this.setRefreshToken(response.data.refresh_token)
            this.saveTokenToCookie()
            this.close()

          })
          .catch(error=>{
            console.log(error)
            this.errorMessage = error.response.data;
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
    }
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
  max-width: 98%;
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
</style>