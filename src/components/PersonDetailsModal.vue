<template>
  <transition name="modal" >
    <form
        action=""
        id="mainForm"
        @submit.prevent="submitBooking"
        method="post"
    >
      <div class="modal-backdrop">
        <div class="modal"
             role="dialog"
        >
          <header
              class="modal-header"
              id="modalTitle"
          >
            <h4>Пожалуйста предоставьте следующую информацию</h4>
              <button
                  type="button"
                  class="btn-close"
                  @click="personDetailsModalClose"
              >
              </button>
          </header>
          <section
              class="modal-body"
              id="modalDescription"
          >
            <div v-if="!isAuthorized">
              <input type="button" class="btn btn-link" @click="showLoginForm" value="Войти"/>

            </div>

            <div v-if="bookingError.length" class="alert alert-danger mt-2">
              <span> {{ bookingError }}</span>
            </div>
            <div class="row">

              <div class="col-md-4">
                <label for="last_name" :class="{ 'text-danger' : clientError.lastName }">Фамилия:</label>
                <input type="text"
                       id="last_name"
                       v-model="person.lastName"
                       required
                       class="form-control"
                       @input="validateLastName"
                       :class="{
                         'is-invalid border-danger text-danger' : clientError.lastName ,
                        'is-valid border-success' : !clientError.lastName && person.lastName
                       }"
                />
                <p v-if="clientError.lastName" class="text-danger">{{ clientError.lastName }}</p>
              </div>

              <div class="col-md-4">
                <label for="first_name" :class="{ 'text-danger' : clientError.firstName }">Имя:</label>
                <input type="text"
                       id="first_name"
                       v-model="person.firstName"
                       required
                       class="form-control"
                       @input="validateFirstName"
                       :class="{
                         'is-invalid border-danger text-danger' : clientError.firstName ,
                         'is-valid border-success' : !clientError.firstName && person.firstName
                       }"
                />
                <p v-if="clientError.firstName" class="text-danger">{{ clientError.firstName }}</p>
              </div>

              <div class="col-md-4">
                <label for="middle_name" :class="{ 'text-danger' : clientError.middleName }">Отчество:</label>
                <input type="text"
                       id="middle_name"
                       v-model="person.middleName"
                       required
                       class="form-control "
                       @input="validateMiddleName"
                       :class="{
                         'is-invalid border-danger text-danger' : clientError.middleName ,
                         'is-valid border-success' : !clientError.middleName && person.middleName
                         }"
                />
                <p v-if="clientError.middleName" class="text-danger">{{ clientError.middleName }}</p>
              </div>

            </div>

            <div class="row">

              <div class="col-md-6" :class="{ 'text-danger' : clientError.phoneNumber }">
                <label for="phone_number" >
                  <i v-if="!person.phoneNumber_confirmed
                        && !clientError.phoneNumber
                        && person.phoneNumber"
                     class="fa fa-warning text-danger"
                     title="Номер телефона не подтвержден"></i>
                  Номер телефона:
                </label>
                <PhoneNumberInput
                       v-model="person.phoneNumber"
                       @input="validatePhoneNumber"
                       :disabled="person.phoneNumber_confirmed"
                       :class="{
                         'is-invalid border-danger text-danger' : clientError.phoneNumber ,
                        'is-valid border-success' : !clientError.phoneNumber && person.phoneNumber
                       }"
                />
              </div>
              <div class="col-md-6">
                <label for="post" :class="{ 'text-danger' : clientError.post }">Должность:</label>
                <vue-select
                    id="post"
                    v-model="person.post"
                    :options="['Студент','Работник']"
                    placeholder="Выберите должность"
                    required
                    @change="validatePost"
                    :class="{
                      'select-invalid is-invalid border-danger' : clientError.post ,
                      'select-valid is-valid border-success' : !clientError.post && person.post
                    }"
                />
              <p v-if="clientError.post" class="text-danger">{{ clientError.post }}</p>
              </div>
            </div>
            <div v-if="person.post=='Студент'">
              <label for="institute" :class="{ 'text-danger' : clientError.institute || !person.institute}">Институт:</label>
              <input
                  type="text"
                  id="institute"
                  class="form-control"
                  v-model="person.institute"
                  @input="validateInstitute"
                  required
                  :class="{
                    'is-invalid border-danger text-danger' : clientError.institute || !person.institute,
                    'is-valid border-success' : !clientError.institute && person.institute
                    }"
              />
              <p v-if="clientError.institute" class="text-danger">{{ clientError.institute }}</p>

              <label for="course" :class="{ 'text-danger' : clientError.course || !person.course}">Курс:</label>
              <vue-select
                  id="course"
                  v-model="person.course"
                  :options="[1,2,3,4,5]"
                  placeholder="Выберите Курс"
                  :class="{
                        'select-invalid is-invalid border-danger' : clientError.course || !person.course,
                        'select-valid is-valid border-success' : !clientError.course && person.course
                      }"
              />
              <p v-if="clientError.course " class="text-danger">{{ clientError.course }}</p>
            </div>
            <div v-else-if="person.post=='Работник'" :class="{ 'text-danger' : clientError.structure || !person.structure}">
              <label for="structure">Структура:</label>
              <input
                  type="text"
                  id="structure"
                  v-model="person.structure"
                  class="form-control"
                  @input="validateStructure"
                  :class="{
                    'is-invalid border-danger text-danger' : clientError.structure || !person.structure,
                    'is-valid border-success' : !clientError.structure && person.structure
                  }"
              />
              <p v-if="clientError.structure " class="text-danger">{{ clientError.structure }}</p>

            </div>
            <label for="comment">Комментарий:</label>
            <textarea id="comment" v-model="comment"/>

          </section>
          <footer class="modal-footer">
              <button
                type="submit"
                class="btn btn-outline-primary"
              >
                {{ this.isAuthorized ? 'Забронировать' : 'Продолжить' }}
              </button>
              <button
                  type="button"
                  class="btn btn-secondary"
                  @click="personDetailsModalClose"
              >
                Закрыть
              </button>
          </footer>
        </div>
      </div>
    </form>
  </transition>
</template>

<script>
import VueSelect from 'vue-select';
import {mapGetters, mapMutations, mapState} from "vuex";
import PhoneNumberInput from "@/components/UI/PhoneNumberInput.vue";

export default {
  components: {
    PhoneNumberInput,
    VueSelect,
  },
  props: {
    bookingError: {
      type: String,
    },

  },
  data(){
    return {
      comment: null,
      clientError: {
        lastName: null,
        firstName: null,
        middleName: null,
        phoneNumber: null,
        post: null,
        institute: null,
        course: null,
        structure:null
      },
      phoneNumber: this.getPhoneNumber,
    }
  },
  name: "PersonDetailsModal",
  methods: {
    ...mapMutations({
      setCustomer: 'setPerson',
      setPersonId: 'setPersonId',
      setIsAuthorized: 'setIsAuthorized',
      setLoginFormShow: 'setLoginFormShow'
    }),
    personDetailsModalClose() {
      this.$emit('personDetailsModalClose');
    },
    submitBooking() {
      if (!this.validateBeforeSubmitting()) {
          return;
      }
      else {
        if (!this.isAuthorized) {
          this.setLoginFormShow(true);
        }
        else {
          if(!this.person.phoneNumber_confirmed){
            this.$emit('verifyPhoneNumber')
          }
          else this.$emit('submitBooking', this.person, this.comment)
        }
      }

    },
    validateFirstName(){
      if (!this.person.firstName) {
        this.clientError.firstName = 'Имя обязательно для заполнения';
      } else if (this.person.firstName.length < 3) {
        this.clientError.firstName = 'Имя должно содержать не менее 1 символа';
      } else {
        this.clientError.firstName = null;
      }
    },
    validateLastName(){
      if (!this.person.lastName) {
        this.clientError.lastName = 'Фамилия обязательно для заполнения';
      } else if (this.person.lastName.length < 2) {
        this.clientError.lastName = 'Фамилия должно содержать не менее 1 символов';
      } else {
        this.clientError.lastName = null;
      }
    },
    validateMiddleName(){
      if (!this.person.middleName) {
        this.clientError.middleName = 'Отчество обязательно для заполнения';
      } else if (this.person.middleName.length < 3) {
        this.clientError.middleName = 'Отчество должно содержать не менее 2 символов';
      } else {
        this.clientError.middleName = null;
      }
    },
    validatePhoneNumber() {
      const regex = /^(\+7|7|8)?[\s-]?\(?[3489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
      if (!regex.test(this.person.phoneNumber)) {
        this.clientError.phoneNumber = 'Номер телефона введен неправильно'
      } else {
        this.clientError.phoneNumber = null
      }
    },
    validateInstitute(){
      if (this.person.post==='Студент' && !this.person.institute) {
        this.clientError.institute = 'Поле обязательно для заполнения';
      } else {
        this.person.structure = null
        this.clientError.institute = null;
      }
    },
    validateStructure(){
      if (this.person.post==='Работник' && !this.person.structure) {
        this.clientError.structure = 'Поле обязательно для заполнения';
      } else {
        this.person.institute = null;
        this.person.course = null;
        this.clientError.structure = null;
      }
    },
    validatePost(){
      if (!this.person.post) {
        this.clientError.post = 'Поле обязательно для заполнения';
      } else {
        this.clientError.post = null;
      }
    },
    validateCourse(){
      if (!this.person.course) {
        this.clientError.course = 'Поле обязательно для заполнения';
      } else {
        this.clientError.course = null;
      }
    },
    showLoginForm(){
      this.setLoginFormShow(true)
      document.body.classList.add('modal-open');
    },
    validateBeforeSubmitting(){
      let isValid = true;
      if(this.person.post===null){
        this.clientError.post = "Пожалуйста выберите должность";
        isValid = false;
      }
      else if(this.person.post==='Студент' && ( this.person.course===0 || this.person.course===null )) {
        this.clientError.course = "Пожалуйста выберите курс";
        isValid = false;
      }
      return isValid;
    }
  },
  computed: {
    ...mapState({
        personId: state => state.person.personId,
        person: state => state.person.person,
        isAuthorized: state => state.person.isAuthorized,
        loginFormShow: state => state.person.loginFormShow
      }),
    ...mapGetters({
        getPhoneNumber: 'phoneNumber'
    }),
  },
  mounted() {
     setTimeout(() =>{
        this.phoneNumber = this.getPhoneNumber
    },200)
  },
  watch: {
    'person.post': function (){
      this.validatePost()
    },
    'person.course': function (){
      this.validateCourse()
    },
  }
}
</script>

<style scoped>
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
    z-index: 999;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    border-radius: 6px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    height: auto;
    max-height: 80vh;
    top: 50%; /* Позиционируем верхнюю границу на 50% от родителя */
    left: 50%; /* Позиционируем левую границу на 50% от родителя */
    transform: translate(-50%, -50%); /* Применяем сдвиг на -50% от размеров модального окна */
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #0f0f0f;
    justify-content: space-between;
  }
  .modal-header h5 {
    margin-right: 15px;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 20px 40px 20px;
  }
  label {
    margin-top: 15px;
  }
  >>> {
    --vs-controls-color: #ebebeb;
    --vs-border-color: #ebebeb;
    --vs-line-height: 33px;
    --vs-dropdown-option-padding: 12px;
    --vs-search-input-placeholder-color: #707079;
  }
  .select-invalid {
    --vs-border-color: red;
  }
  .select-valid {
    --vs-border-color: green;
  }
  textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #ebebeb;
    border-radius: 2px;
    font-size: 16px;
    color: #19191a;
    font-weight: 500;
    padding-left: 20px;
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