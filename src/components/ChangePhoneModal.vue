<template>
  <transition name="success-modal">
    <div class="modal-backdrop">
      <div class="modal"
           role="dialog"
      >
        <header
            class="modal-header"
            id="modalTitle"
        >
          <h4 class="text-center">Подтвердите номер телефона</h4>
        <button
            type="button"
            class="btn-close"
            @click="close"
        ></button>
        </header>
        <section
            class="modal-body"
            id="modalDescription"
        >
          <div class="phone-login-form">
            <div class="mb-3 text-center" v-if="!isCodeInputShow" >Мы отправим на номер SMS-сообщение с кодом подтверждения</div>
            <div>
              <label for="phone_number" >Номер телефона:</label>
              <phone-number-input
                  v-model="person.phoneNumber"
                  @input="validatePhoneNumber"
                  @keydown.enter="next"
                  :disabled="isCodeInputShow"
                  :class="{
                    'is-invalid border-danger' : clientError.phoneNumber,
                    'is-valid' : !clientError.phoneNumber && person.phoneNumber
                  }"
              ></phone-number-input>
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
                >
              </div>
                <p v-if="clientError.code" class="text-danger mt-1">{{ errorMessage }}</p>
            </div>
          </div>

        </section>
        <footer class="modal-footer">
          {{ smsCode ? 'Код: '+smsCode.code : '' }}
          <div class="phone-footer w-100">
            <button
                v-if="!isCodeInputShow"
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
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import phoneNumberInput from "@/components/UI/PhoneNumberInput.vue";
import {mapMutations, mapState} from "vuex";
import axios from "axios";
export default {
  name: "changePhone",
  components:{
    phoneNumberInput
  },
  emits: {
    close: null,
  },
  data() {
    return {
      clientError: {
        phoneNumber: null,
        code: null
      },
      errorMessage:null,
      isCodeInputShow: false,
      code: null,
      smsCode: null,
    }
  },
  methods:{
    ...mapMutations({
      setCustomer: 'setPerson',
      setPhoneNumber: 'setPhoneNumber',
      setPhoneNumberConfirmed: 'setPhoneNumberConfirmed'
    }),
    sendSmsCode() {
      axios.post(`http://localhost:8080/sms/sendSms?phoneNumber=${encodeURIComponent(this.person.phoneNumber)}`,  )
          .then((response) => {
            this.smsCode = response.data;
            this.errorMessage = '';
          })
          .catch((error) => {
            console.log(error);
            this.errorMessage = 'Error sending SMS code';
          });
    },
    close(){
      this.isCodeInputShow = false;
      this.smsCode = null;
      this.code = null;
      this.$emit('close');
    },
    next(){
      if(this.person.phoneNumber!==null && this.clientError.phoneNumber==null){
        this.sendSmsCode();
        this.isCodeInputShow = true;
      }
      else this.clientError.phoneNumber='Номер телефона не корректный';
    },
    verify(){
      axios.post(`http://localhost:8080/sms/verifyCode?code=${this.code}&phoneNumber=${encodeURIComponent(this.person.phoneNumber)}`,{},
      {
        headers: {
          'Authorization': 'Bearer ' + this.access_token
        }
      }
      )
          .then((response) => {
            // response.data = Person
            this.setPhoneNumber(response.data.phoneNumber)
            this.setPhoneNumberConfirmed(response.data.phoneNumber_confirmed)
            this.close()
          })
          .catch((error) => {
            this.clientError.code = error.response.data;
            console.log(error.response.data);
            this.errorMessage = error.response.data;
          });
    },
    codeInput() {
      this.clientError.code = null;
    },
    validatePhoneNumber(){
      const regex = /^(\+7|7|8)?[\s-]?\(?[3489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
      if (!regex.test(this.person.phoneNumber)) {
        this.clientError.phoneNumber = 'Номер телефона введен неправильно';
      } else {
        this.clientError.phoneNumber = null;
      }
    },
  },
  computed: {
    ...mapState({
      person: state => state.person.person,
      access_token: state => state.person.access_token
    }),
  },
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
  z-index: 1002;
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
label {
  font-size: 14px;
  color: #707079;
  display: block;
  margin-bottom: 5px;
  margin-top: 15px;
}
</style>