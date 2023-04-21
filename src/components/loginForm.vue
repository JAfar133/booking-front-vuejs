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
          <h4 class="text-center">Вход или регистрация</h4>
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
          <h6 class="mb-3" v-if="!isDisabled" >Мы отправим на номер SMS-сообщение с кодом подтверждения</h6>
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
            <div v-if="isDisabled" class="mt-3">
              <label for="">Введите смс код, который мы отправили вам на номер телефона</label>
              <input
                  type="text"
                  v-model="code"
                  class="form-control"
                  :class="{
                    'is-invalid border-danger' : clientError.code,
                  }"
                  @input="codeInput"
              >
            </div>
          </div>
        </section>
        <footer class="modal-footer">
          {{ smsCode ? 'Код: '+smsCode.code : '' }}
            <button
                v-if="!isDisabled"
                type="button"
                class="btn btn-outline-primary"
                @click="next"
            >
              Получить код
            </button>
            <button
                v-else
                type="button"
                class="btn btn-outline-primary"
                @click="verify"
            >
              Подтвердить
            </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import {mapMutations, mapState} from "vuex";
import axios from "axios";
import VueCookies from "vue-cookies";
export default {
  name: "loginForm",
  components: {PhoneNumberInput},

  data() {
    return {
      clientError: {
        phoneNumber: null,
        code: null
      },
      errorMessage:null,
      isDisabled: false,
      code: null,
      smsCode: null
    }
  },
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow'
    }),
    close(){
      this.isDisabled = false;
      this.smsCode = null;
      this.code = null;
      this.$emit('close');
    },
    validatePhoneNumber(){
      const regex = /^(\+7|7|8)?[\s-]?\(?[3489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
      if (!regex.test(this.person.phoneNumber)) {
        this.clientError.phoneNumber = 'Номер телефона введен неправильно';
      } else {
        this.clientError.phoneNumber = null;
      }
    },
    codeInput() {
        this.clientError.code = null;

    },
    sendSmsCode() {
      axios.post('http://localhost:8080/auth/sendSms', this.person.phoneNumber )
          .then((response) => {
            this.smsCode = response.data;
            this.errorMessage = '';
          })
          .catch((error) => {
            console.log(error);
            this.errorMessage = 'Error sending SMS code';
          });
    },
    verify(){
      axios.post(`http://localhost:8080/auth/verifyCode?code=${this.code}`, this.person)
          .then((response) => {
            this.setCustomer(response.data);
            this.setIsAuthorized(true);
            this.setPersonId(response.data.id);
            this.savePersonIdToCookies();
            this.errorMessage = '';
            this.close();
          })
          .catch((error) => {
            this.clientError.code = "Неверный код";
            console.log(error.response.data);
            this.errorMessage = error.response.data;
          });
    },
    next(){
      if(this.person.phoneNumber!==null && this.clientError.phoneNumber==null){
        this.sendSmsCode();
        this.isDisabled = true;
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
      loginFormShow: state => state.person.loginFormShow
    }),

  },
  mounted() {
    this.isDisabled = false;
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
  background-color: rgba(0, 0, 0, 0.1);
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
  input[type="text"] {
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

</style>