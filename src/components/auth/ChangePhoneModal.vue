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
          <h4 class="text-center"><slot name="header"></slot></h4>
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
<!--                <input-->
<!--                    type="text"-->
<!--                    v-model="code"-->
<!--                    class="form-control"-->
<!--                    :class="{-->
<!--                      'is-invalid border-danger' : clientError.code,-->
<!--                    }"-->
<!--                    @input="codeInput"-->
<!--                    @keydown.enter="verify"-->
<!--                >-->
                <div class="code-inputs">
                  <template :key="input.id" v-for="input in inputs">
                    <input
                        type="tel"
                        :ref="input.id"
                        v-model="input.value"
                        :id="input.id"
                        @keydown="inputKeyDown"
                        @input="codeInput"
                        @paste="pasteCode"
                        :class="{'danger': clientError.code}"
                    >
                  </template>
                </div>
                <div class="mt-4 text-danger text-center" v-if="clientError.code"
                >{{ errorMessage }}</div>
              </div>
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
import {sendSms, verifyCode} from "@/api/personApi";

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
      code: '',
      smsCode: null,
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
  methods:{
    ...mapMutations({
      setCustomer: 'setPerson',
      setPhoneNumber: 'setPhoneNumber',
      setPhoneNumberConfirmed: 'setPhoneNumberConfirmed'
    }),
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
      if(this.inputs[id-1].value!=="" && id!==this.inputs.length){
        document.getElementById(String(id+1)).focus();
      }

      for(input of this.inputs){
        if(input.value!=="") {
          this.code+=input.value;
        }
      }
      if(this.code.length===this.inputs.length){
        this.verify();
      }
      else {
        this.code = '';
      }
    },
    pasteCode(event){
      const inputId = Number(event.target.id);
      const inputData = event.clipboardData.getData('text/plain');
      let pos = 0;
      for (let i = inputId-1; i < inputData.length+inputId-1; i++) {
        this.inputs[i].value = inputData.slice(pos,pos+1)
        console.log("id="+i+"value:"+this.inputs[i].value)
        document.getElementById(String(i+1)).focus();
        pos++;
      }
    },
    sendSmsCode() {
        this.loaderShow = true;
        sendSms(this.person.phoneNumber,true)
            .then((smsCode)=>{
              setTimeout(()=>{
                alert(`Ваш код из СМС: ${smsCode.code}`)
                this.smsCode = smsCode;
                document.getElementById("1").focus();
              },500)
              this.errorMessage = '';
              this.loaderShow = false;
              this.isCodeInputShow = true;
            })
            .catch(()=>{
              this.errorMessage = 'Error sending SMS code';
              this.loaderShow = false;
            })
    },
    close(){
      this.isCodeInputShow = false;
      this.smsCode = null;
      this.code = null;
      this.$emit('close');
      document.body.classList.remove('modal-open');
    },
    next(){
      if(this.person.phoneNumber!==null && this.clientError.phoneNumber==null){
        this.sendSmsCode();
      }
      else this.clientError.phoneNumber='Номер телефона не корректный';
    },
    verify(){
      verifyCode(this.code,this.person.phoneNumber)
          .then((person) => {
            this.setPhoneNumber(person.phoneNumber)
            this.setPhoneNumberConfirmed(person.phoneNumber_confirmed)
            this.close()
          })
          .catch((error) => {
            this.clientError.code = error;
            this.errorMessage = error;
            this.loaderShow = false;
          });
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
      access_token: state => state.person.access_token,
      modalOpen: state => state.person.loginFormShow
    }),
  },
  mounted() {
    if(this.modalOpen){
      document.body.classList.add('modal-open');
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
  background-color: rgba(0, 0, 0, 0.4);
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
</style>